package com.example

import com.example.data.model.AiProviderType
import com.example.data.repository.AiRepository
import org.junit.Assert.*
import org.junit.Test

class ExampleUnitTest {
  @Test
  fun addition_isCorrect() {
    assertEquals(4, 2 + 2)
  }

  @Test
  fun testProviderStatusList() {
    val repository = AiRepository()
    val providers = repository.getProvidersStatus()
    assertTrue(providers.any { it.type == AiProviderType.GROQ })
    assertTrue(providers.any { it.type == AiProviderType.HUGGING_FACE })
    assertTrue(providers.none { it.type.name == "GEMINI" })
  }
}

