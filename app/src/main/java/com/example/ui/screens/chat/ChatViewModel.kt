package com.example.ui.screens.chat

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.data.local.AppDatabase
import com.example.data.model.ChatMessageEntity
import com.example.data.model.ChatSessionEntity
import com.example.data.repository.AiRepository
import com.example.data.repository.AppRepository
import com.example.service.VoiceManager
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.flatMapLatest
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

data class ChatUiState(
    val currentSessionId: String = "",
    val availableModels: List<String> = listOf(
        "llama-3.3-70b-versatile",
        "deepseek-r1-distill-llama-70b",
        "llama-3.1-8b-instant",
        "mixtral-8x7b-32768"
    ),
    val selectedModel: String = "llama-3.3-70b-versatile",
    val isGenerating: Boolean = false,
    val errorMessage: String? = null,
    val inputText: String = ""
)

@OptIn(ExperimentalCoroutinesApi::class)
class ChatViewModel(application: Application) : AndroidViewModel(application) {
    private val database = AppDatabase.getInstance(application)
    private val appRepository = AppRepository(database)
    private val aiRepository = AiRepository()
    val voiceManager = VoiceManager(application)

    private val _uiState = MutableStateFlow(ChatUiState())
    val uiState: StateFlow<ChatUiState> = _uiState.asStateFlow()

    private val _currentSessionId = MutableStateFlow("")

    val messages: StateFlow<List<ChatMessageEntity>> = _currentSessionId
        .flatMapLatest { sessionId ->
            if (sessionId.isBlank()) {
                MutableStateFlow(emptyList())
            } else {
                appRepository.getMessagesForSession(sessionId)
            }
        }
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000),
            initialValue = emptyList()
        )

    val allSessions: StateFlow<List<ChatSessionEntity>> = appRepository.allSessions
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000),
            initialValue = emptyList()
        )

    init {
        initializeFirstSession()
    }

    private fun initializeFirstSession() {
        viewModelScope.launch {
            val newId = appRepository.createNewSession("New Chat")
            _currentSessionId.value = newId
            _uiState.value = _uiState.value.copy(currentSessionId = newId)
        }
    }

    fun selectSession(sessionId: String) {
        _currentSessionId.value = sessionId
        _uiState.value = _uiState.value.copy(currentSessionId = sessionId)
    }

    fun createNewSession() {
        viewModelScope.launch {
            val newId = appRepository.createNewSession("New Chat")
            _currentSessionId.value = newId
            _uiState.value = _uiState.value.copy(currentSessionId = newId)
        }
    }

    fun setModel(model: String) {
        _uiState.value = _uiState.value.copy(selectedModel = model)
    }

    fun setInputText(text: String) {
        _uiState.value = _uiState.value.copy(inputText = text)
    }

    fun sendMessage() {
        val text = _uiState.value.inputText.trim()
        if (text.isBlank() || _uiState.value.isGenerating) return

        val sessionId = _uiState.value.currentSessionId
        if (sessionId.isBlank()) return

        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(inputText = "", isGenerating = true, errorMessage = null)

            // Save user message
            appRepository.addMessage(
                ChatMessageEntity(
                    sessionId = sessionId,
                    role = "user",
                    content = text,
                    modelUsed = _uiState.value.selectedModel
                )
            )

            // Build history list
            val currentMsgs = messages.value.map { it.role to it.content } + ("user" to text)

            try {
                val aiResponseText = aiRepository.generateChatResponse(
                    messages = currentMsgs,
                    model = _uiState.value.selectedModel
                )

                // Save model message
                appRepository.addMessage(
                    ChatMessageEntity(
                        sessionId = sessionId,
                        role = "model",
                        content = aiResponseText,
                        modelUsed = _uiState.value.selectedModel
                    )
                )
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(errorMessage = e.message ?: "Failed to generate response")
            } finally {
                _uiState.value = _uiState.value.copy(isGenerating = false)
            }
        }
    }

    fun regenerateLastMessage() {
        val msgs = messages.value
        if (msgs.isEmpty() || _uiState.value.isGenerating) return

        val lastUserMsg = msgs.lastOrNull { it.role == "user" } ?: return
        val sessionId = _uiState.value.currentSessionId

        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isGenerating = true, errorMessage = null)
            try {
                val history = msgs.takeWhile { it.id != lastUserMsg.id }.map { it.role to it.content } + ("user" to lastUserMsg.content)
                val aiResponse = aiRepository.generateChatResponse(history, _uiState.value.selectedModel)

                appRepository.addMessage(
                    ChatMessageEntity(
                        sessionId = sessionId,
                        role = "model",
                        content = aiResponse,
                        modelUsed = _uiState.value.selectedModel
                    )
                )
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(errorMessage = e.message ?: "Error regenerating response")
            } finally {
                _uiState.value = _uiState.value.copy(isGenerating = false)
            }
        }
    }

    fun startVoiceInput() {
        voiceManager.startListening(
            onResult = { transcript ->
                _uiState.value = _uiState.value.copy(inputText = transcript)
            },
            onError = { err ->
                _uiState.value = _uiState.value.copy(errorMessage = err)
            }
        )
    }

    fun stopVoiceInput() {
        voiceManager.stopListening()
    }

    fun speakText(text: String) {
        voiceManager.speak(text)
    }

    fun stopSpeaking() {
        voiceManager.stopSpeaking()
    }

    override fun onCleared() {
        super.onCleared()
        voiceManager.destroy()
    }
}
