package com.example.data.remote

import okhttp3.RequestBody
import okhttp3.ResponseBody
import retrofit2.http.Body
import retrofit2.http.Header
import retrofit2.http.POST
import retrofit2.http.Path

interface HuggingFaceApiService {
    @POST("models/{model}")
    suspend fun generateImage(
        @Header("Authorization") authHeader: String,
        @Path(value = "model", encoded = true) model: String,
        @Body request: HuggingFaceImageRequest
    ): ResponseBody

    @POST("models/{model}")
    suspend fun queryVisionModel(
        @Header("Authorization") authHeader: String,
        @Path(value = "model", encoded = true) model: String,
        @Body request: RequestBody
    ): ResponseBody
}
