package com.example.data.remote

import com.squareup.moshi.Json
import com.squareup.moshi.JsonClass

@JsonClass(generateAdapter = true)
data class GroqChatRequest(
    @Json(name = "model") val model: String = "llama-3.3-70b-versatile",
    @Json(name = "messages") val messages: List<GroqMessage>,
    @Json(name = "temperature") val temperature: Float? = 0.7f,
    @Json(name = "max_tokens") val maxTokens: Int? = 4096,
    @Json(name = "response_format") val responseFormat: GroqResponseFormat? = null
)

@JsonClass(generateAdapter = true)
data class GroqResponseFormat(
    @Json(name = "type") val type: String = "text" // "text" or "json_object"
)

@JsonClass(generateAdapter = true)
data class GroqMessage(
    @Json(name = "role") val role: String, // "system", "user", "assistant"
    @Json(name = "content") val content: String
)

@JsonClass(generateAdapter = true)
data class GroqChatResponse(
    @Json(name = "id") val id: String? = null,
    @Json(name = "choices") val choices: List<GroqChoice>? = null,
    @Json(name = "usage") val usage: GroqUsage? = null,
    @Json(name = "error") val error: GroqApiError? = null
)

@JsonClass(generateAdapter = true)
data class GroqChoice(
    @Json(name = "index") val index: Int? = 0,
    @Json(name = "message") val message: GroqMessage? = null,
    @Json(name = "finish_reason") val finishReason: String? = null
)

@JsonClass(generateAdapter = true)
data class GroqUsage(
    @Json(name = "prompt_tokens") val promptTokens: Int? = null,
    @Json(name = "completion_tokens") val completionTokens: Int? = null,
    @Json(name = "total_tokens") val totalTokens: Int? = null,
    @Json(name = "total_time") val totalTime: Float? = null
)

@JsonClass(generateAdapter = true)
data class GroqApiError(
    @Json(name = "message") val message: String? = null,
    @Json(name = "type") val type: String? = null,
    @Json(name = "code") val code: String? = null
)
