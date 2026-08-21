package com.example.ui.screens.code

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.Code
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.repository.AiRepository
import com.example.ui.components.CodeHighlightBlock
import com.example.ui.components.NandiFooter
import com.example.ui.components.NandiLogo
import com.example.ui.theme.CyberDarkCard
import com.example.ui.theme.CyberDarkSurfaceVariant
import com.example.ui.theme.CyberGreen
import com.example.ui.theme.CyberPurple
import com.example.ui.theme.NeonCyan
import com.example.ui.theme.TextMutedDark
import com.example.ui.theme.TextPrimaryDark
import com.example.ui.theme.TextSecondaryDark
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

val languages = listOf("Kotlin", "Python", "TypeScript", "JavaScript", "SQL", "Rust", "HTML/CSS")

val codePresets = listOf(
    "Kotlin Coroutine Flow Pipeline",
    "FastAPI Neural Inference Endpoint",
    "React TypeScript Glassmorphic Card",
    "PostgreSQL Room Migration Schema"
)

@Composable
fun CodeStudioScreen(
    modifier: Modifier = Modifier
) {
    var selectedLang by remember { mutableStateOf("Kotlin") }
    var prompt by remember { mutableStateOf("") }
    var isGenerating by remember { mutableStateOf(false) }
    var generatedCode by remember {
        mutableStateOf(
            """// NandiAi Generated Kotlin Architecture
package com.example.nandiai.engine

import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow

class GroqInferencePipeline(
    private val model: String = "llama-3.3-70b-versatile"
) {
    suspend fun streamTokens(prompt: String): Flow<String> = flow {
        println("Dispatching to Groq LPU on Render Edge: ${'$'}model")
        val tokens = prompt.split(" ")
        for (token in tokens) {
            emit("${'$'}token ")
        }
    }
}"""
        )
    }
    var codeExplanation by remember {
        mutableStateOf(
            "This reactive stream architecture processes asynchronous neural tokens using Groq LPU inference with zero-copy buffer allocations."
        )
    }

    val scope = rememberCoroutineScope()
    val aiRepository = remember { AiRepository() }

    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .padding(horizontal = 16.dp)
            .testTag("code_studio_screen"),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        item {
            Spacer(modifier = Modifier.height(8.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                NandiLogo(size = 32.dp)
                Surface(
                    shape = RoundedCornerShape(20.dp),
                    color = CyberDarkSurfaceVariant,
                    border = androidx.compose.foundation.BorderStroke(1.dp, CyberGreen.copy(alpha = 0.5f))
                ) {
                    Text(
                        text = "Code Intelligence LPU",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = CyberGreen,
                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp)
                    )
                }
            }
        }

        // Title
        item {
            Column {
                Text(
                    text = "AI Code Studio",
                    fontSize = 24.sp,
                    fontWeight = FontWeight.Black,
                    color = Color.White
                )
                Text(
                    text = "Generate, optimize, and debug production-grade code in any language.",
                    fontSize = 13.sp,
                    color = TextSecondaryDark
                )
            }
        }

        // Language Selector Row
        item {
            LazyRow(
                horizontalArrangement = Arrangement.spacedBy(6.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                items(languages) { lang ->
                    val isSelected = selectedLang == lang
                    Surface(
                        shape = RoundedCornerShape(10.dp),
                        color = if (isSelected) CyberGreen.copy(alpha = 0.2f) else CyberDarkSurfaceVariant,
                        border = androidx.compose.foundation.BorderStroke(
                            1.dp,
                            if (isSelected) CyberGreen else Color.Transparent
                        ),
                        modifier = Modifier.clickable { selectedLang = lang }
                    ) {
                        Text(
                            text = lang,
                            fontSize = 11.sp,
                            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                            color = if (isSelected) CyberGreen else TextSecondaryDark,
                            modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp)
                        )
                    }
                }
            }
        }

        // Prompt Input Card
        item {
            Surface(
                shape = RoundedCornerShape(16.dp),
                color = CyberDarkCard,
                border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFF1E2D4A)),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Text(
                        text = "DESCRIBE CODE OR FUNCTIONALITY",
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 1.sp,
                        color = CyberGreen
                    )

                    Spacer(modifier = Modifier.height(8.dp))

                    OutlinedTextField(
                        value = prompt,
                        onValueChange = { prompt = it },
                        placeholder = {
                            Text(
                                "e.g. Write a thread-safe caching service with TTL eviction in $selectedLang...",
                                fontSize = 13.sp,
                                color = TextMutedDark
                            )
                        },
                        modifier = Modifier
                            .fillMaxWidth()
                            .testTag("code_prompt_input"),
                        shape = RoundedCornerShape(12.dp),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = CyberGreen,
                            unfocusedBorderColor = Color(0xFF1E2D4A),
                            focusedTextColor = TextPrimaryDark,
                            unfocusedTextColor = TextPrimaryDark
                        )
                    )

                    Spacer(modifier = Modifier.height(10.dp))

                    // Preset Chips
                    LazyRow(
                        horizontalArrangement = Arrangement.spacedBy(6.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        items(codePresets) { preset ->
                            Surface(
                                shape = RoundedCornerShape(8.dp),
                                color = CyberDarkSurfaceVariant,
                                modifier = Modifier.clickable { prompt = preset }
                            ) {
                                Text(
                                    text = preset,
                                    fontSize = 10.sp,
                                    color = TextSecondaryDark,
                                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                                )
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    Button(
                        onClick = {
                            if (prompt.isNotBlank()) {
                                scope.launch {
                                    isGenerating = true
                                    delay(400)
                                    val (code, explanation) = aiRepository.generateCodeWithGroq(selectedLang, prompt)
                                    generatedCode = code
                                    codeExplanation = explanation
                                    isGenerating = false
                                }
                            }
                        },
                        enabled = prompt.isNotBlank() && !isGenerating,
                        shape = RoundedCornerShape(12.dp),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = CyberGreen,
                            contentColor = Color(0xFF022B18)
                        ),
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(46.dp)
                            .testTag("generate_code_btn")
                    ) {
                        if (isGenerating) {
                            CircularProgressIndicator(modifier = Modifier.size(18.dp), color = Color(0xFF022B18), strokeWidth = 2.dp)
                            Spacer(modifier = Modifier.width(8.dp))
                            Text("Compiling Abstract Syntax Tree...", fontWeight = FontWeight.Bold)
                        } else {
                            Icon(imageVector = Icons.Default.AutoAwesome, contentDescription = null, modifier = Modifier.size(18.dp))
                            Spacer(modifier = Modifier.width(8.dp))
                            Text("Synthesize $selectedLang Code", fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }
        }

        // Generated Code View
        item {
            CodeHighlightBlock(
                code = generatedCode,
                language = selectedLang.lowercase()
            )
        }

        // Explanation Card
        item {
            Surface(
                shape = RoundedCornerShape(14.dp),
                color = CyberDarkCard,
                border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFF1E2D4A)),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Text(
                        text = "ARCHITECTURAL OVERVIEW",
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 1.sp,
                        color = CyberGreen
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        text = codeExplanation,
                        fontSize = 12.sp,
                        lineHeight = 18.sp,
                        color = TextSecondaryDark
                    )
                }
            }
        }

        item {
            NandiFooter()
            Spacer(modifier = Modifier.height(64.dp))
        }
    }
}
