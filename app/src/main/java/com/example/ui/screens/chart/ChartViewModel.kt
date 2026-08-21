package com.example.ui.screens.chart

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.data.local.AppDatabase
import com.example.data.model.GeneratedChartEntity
import com.example.data.model.ParsedChart
import com.example.data.repository.AiRepository
import com.example.data.repository.AppRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

data class ChartUiState(
    val prompt: String = "",
    val isGenerating: Boolean = false,
    val currentChart: ParsedChart? = null,
    val errorMessage: String? = null
)

class ChartViewModel(application: Application) : AndroidViewModel(application) {
    private val database = AppDatabase.getInstance(application)
    private val repository = AppRepository(database)
    private val aiRepository = AiRepository()

    private val _uiState = MutableStateFlow(ChartUiState())
    val uiState: StateFlow<ChartUiState> = _uiState.asStateFlow()

    val savedCharts: StateFlow<List<GeneratedChartEntity>> = repository.allCharts
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000),
            initialValue = emptyList()
        )

    init {
        // Initial sample chart
        generateChart("AI Model Performance Comparison 2026")
    }

    fun setPrompt(prompt: String) {
        _uiState.value = _uiState.value.copy(prompt = prompt)
    }

    fun generateChart(overridePrompt: String? = null) {
        val targetPrompt = overridePrompt ?: _uiState.value.prompt.trim()
        if (targetPrompt.isBlank() || _uiState.value.isGenerating) return

        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isGenerating = true, errorMessage = null)
            try {
                val chart = aiRepository.generateChartData(targetPrompt)
                _uiState.value = _uiState.value.copy(
                    currentChart = chart,
                    isGenerating = false,
                    prompt = targetPrompt
                )

                // Save to Room DB
                repository.saveGeneratedChart(
                    GeneratedChartEntity(
                        prompt = targetPrompt,
                        title = chart.title,
                        chartType = chart.type,
                        xAxis = chart.xAxis,
                        yAxis = chart.yAxis,
                        seriesKey = chart.seriesKey,
                        rawJson = ""
                    )
                )
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    isGenerating = false,
                    errorMessage = e.message ?: "Failed to generate chart"
                )
            }
        }
    }

    fun changeChartType(newType: String) {
        val current = _uiState.value.currentChart ?: return
        _uiState.value = _uiState.value.copy(
            currentChart = current.copy(type = newType)
        )
    }

    fun deleteChart(id: Long) {
        viewModelScope.launch {
            repository.deleteChart(id)
        }
    }
}
