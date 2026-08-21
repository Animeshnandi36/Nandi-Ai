package com.example.data.remote

import com.squareup.moshi.Json
import com.squareup.moshi.JsonClass

@JsonClass(generateAdapter = true)
data class HuggingFaceImageRequest(
    @Json(name = "inputs") val inputs: String,
    @Json(name = "parameters") val parameters: Map<String, String>? = null
)

@JsonClass(generateAdapter = true)
data class HuggingFaceErrorResponse(
    @Json(name = "error") val error: String? = null,
    @Json(name = "estimated_time") val estimatedTime: Float? = null
)
