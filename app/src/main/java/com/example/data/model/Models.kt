package com.example.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "chat_sessions")
data class ChatSessionEntity(
    @PrimaryKey val id: String,
    val title: String,
    val createdAt: Long = System.currentTimeMillis(),
    val updatedAt: Long = System.currentTimeMillis(),
    val isPinned: Boolean = false,
    val preview: String = "",
    val projectTag: String = "General"
)

@Entity(tableName = "chat_messages")
data class ChatMessageEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val sessionId: String,
    val role: String, // "user" or "model"
    val content: String,
    val timestamp: Long = System.currentTimeMillis(),
    val modelUsed: String = "llama-3.3-70b-versatile",
    val chartJson: String? = null,
    val codeSnippet: String? = null,
    val imageUri: String? = null,
    val status: String = "SUCCESS" // SUCCESS, ERROR, LOADING
)

@Entity(tableName = "projects")
data class ProjectEntity(
    @PrimaryKey val id: String,
    val name: String,
    val description: String,
    val iconName: String = "Folder",
    val colorHex: String = "#00F0FF",
    val createdAt: Long = System.currentTimeMillis(),
    val updatedAt: Long = System.currentTimeMillis(),
    val conversationCount: Int = 0,
    val assetCount: Int = 0
)

@Entity(tableName = "generated_images")
data class GeneratedImageEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val prompt: String,
    val modelUsed: String = "FLUX.1-schnell",
    val imageBase64OrUrl: String,
    val timestamp: Long = System.currentTimeMillis(),
    val aspectRatio: String = "1:1",
    val isFavorite: Boolean = false
)

@Entity(tableName = "generated_charts")
data class GeneratedChartEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val prompt: String,
    val title: String,
    val chartType: String, // "bar", "line", "area", "pie", "scatter"
    val xAxis: String,
    val yAxis: String,
    val seriesKey: String,
    val rawJson: String,
    val timestamp: Long = System.currentTimeMillis()
)

data class ChartDataItem(
    val label: String,
    val value: Float,
    val secondaryValue: Float? = null,
    val colorHex: String? = null
)

data class ParsedChart(
    val title: String,
    val type: String,
    val xAxis: String,
    val yAxis: String,
    val seriesKey: String = "value",
    val items: List<ChartDataItem>,
    val notes: String = ""
)

enum class AiProviderType(val displayName: String, val badge: String) {
    GROQ("Groq LPU", "Main AI & Ultra-Fast LLM"),
    HUGGING_FACE("Hugging Face", "Visual Diffusion & Vision"),
    SEARCH("Web Grounding", "Live Knowledge")
}

data class ProviderStatus(
    val type: AiProviderType,
    val isConfigured: Boolean,
    val defaultModel: String,
    val statusMessage: String
)
