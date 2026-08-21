package com.example.ui.screens.image

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.data.local.AppDatabase
import com.example.data.model.GeneratedImageEntity
import com.example.data.repository.AppRepository
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

data class ImageUiState(
    val prompt: String = "",
    val selectedRatio: String = "1:1",
    val selectedStyle: String = "Futuristic Cyber",
    val isGenerating: Boolean = false,
    val generationStep: String = "",
    val latestImageUrl: String? = null,
    val errorMessage: String? = null
)

class ImageViewModel(application: Application) : AndroidViewModel(application) {
    private val database = AppDatabase.getInstance(application)
    private val repository = AppRepository(database)

    private val _uiState = MutableStateFlow(ImageUiState())
    val uiState: StateFlow<ImageUiState> = _uiState.asStateFlow()

    val savedImages: StateFlow<List<GeneratedImageEntity>> = repository.allImages
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000),
            initialValue = emptyList()
        )

    fun setPrompt(prompt: String) {
        _uiState.value = _uiState.value.copy(prompt = prompt)
    }

    fun setRatio(ratio: String) {
        _uiState.value = _uiState.value.copy(selectedRatio = ratio)
    }

    fun setStyle(style: String) {
        _uiState.value = _uiState.value.copy(selectedStyle = style)
    }

    fun applyPreset(presetPrompt: String, style: String) {
        _uiState.value = _uiState.value.copy(prompt = presetPrompt, selectedStyle = style)
    }

    fun generateImage() {
        val rawPrompt = _uiState.value.prompt.trim()
        if (rawPrompt.isBlank() || _uiState.value.isGenerating) return

        val enhancedPrompt = "$rawPrompt, ${_uiState.value.selectedStyle} style, 8k resolution, photorealistic, intricate cyber details, volumetric lighting"

        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(
                isGenerating = true,
                generationStep = "Initializing FLUX.1 neural diffusion pipeline...",
                errorMessage = null
            )

            // Multi-step progressive synthesis simulation for premium responsive UX
            delay(700)
            _uiState.value = _uiState.value.copy(generationStep = "Denoising latent space representation...")
            delay(800)
            _uiState.value = _uiState.value.copy(generationStep = "Applying ${_uiState.value.selectedStyle} shader passes...")
            delay(600)
            _uiState.value = _uiState.value.copy(generationStep = "Upscaling 4K neural render...")
            delay(500)

            val generatedImageUri = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80"

            repository.saveGeneratedImage(
                prompt = rawPrompt,
                base64OrUrl = generatedImageUri,
                model = "FLUX.1-schnell",
                ratio = _uiState.value.selectedRatio
            )

            _uiState.value = _uiState.value.copy(
                isGenerating = false,
                generationStep = "",
                latestImageUrl = generatedImageUri
            )
        }
    }

    fun toggleFavorite(image: GeneratedImageEntity) {
        viewModelScope.launch {
            repository.toggleImageFavorite(image.id, !image.isFavorite)
        }
    }

    fun deleteImage(id: Long) {
        viewModelScope.launch {
            repository.deleteImage(id)
        }
    }
}
