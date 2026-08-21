package com.example.ui.screens.chat

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.ArrowDropDown
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.ContentCopy
import androidx.compose.material.icons.filled.Mic
import androidx.compose.material.icons.filled.MicOff
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Send
import androidx.compose.material.icons.filled.SmartToy
import androidx.compose.material.icons.filled.Stop
import androidx.compose.material.icons.filled.VolumeUp
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextFieldDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalClipboardManager
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.ChatMessageEntity
import com.example.ui.components.CodeHighlightBlock
import com.example.ui.components.NandiLogo
import com.example.ui.theme.CyberDarkCard
import com.example.ui.theme.CyberDarkSurface
import com.example.ui.theme.CyberDarkSurfaceVariant
import com.example.ui.theme.CyberGold
import com.example.ui.theme.CyberGreen
import com.example.ui.theme.CyberPurple
import com.example.ui.theme.CyberRed
import com.example.ui.theme.NeonCyan
import com.example.ui.theme.NeonCyanDark
import com.example.ui.theme.TextMutedDark
import com.example.ui.theme.TextPrimaryDark
import com.example.ui.theme.TextSecondaryDark
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ChatScreen(
    viewModel: ChatViewModel,
    modifier: Modifier = Modifier
) {
    val uiState by viewModel.uiState.collectAsState()
    val messages by viewModel.messages.collectAsState()
    val isListening by viewModel.voiceManager.isListening.collectAsState()
    val listState = rememberLazyListState()

    var modelMenuExpanded by remember { mutableStateOf(false) }

    LaunchedEffect(messages.size, uiState.isGenerating) {
        if (messages.isNotEmpty()) {
            listState.animateScrollToItem(messages.size - 1)
        }
    }

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .testTag("chat_screen")
    ) {
        // Top Bar
        Surface(
            color = CyberDarkSurface,
            border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFF1E2D4A)),
            modifier = Modifier.fillMaxWidth()
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 12.dp, vertical = 8.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                NandiLogo(size = 32.dp)

                // Model Selector Dropdown
                Box {
                    Surface(
                        shape = RoundedCornerShape(20.dp),
                        color = CyberDarkSurfaceVariant,
                        border = androidx.compose.foundation.BorderStroke(1.dp, NeonCyan.copy(alpha = 0.35f)),
                        modifier = Modifier
                            .clickable { modelMenuExpanded = true }
                            .testTag("model_selector_btn")
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp)
                        ) {
                            Icon(
                                imageVector = Icons.Default.AutoAwesome,
                                contentDescription = null,
                                tint = NeonCyan,
                                modifier = Modifier.size(14.dp)
                            )
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(
                                text = uiState.selectedModel.take(15),
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = NeonCyan
                            )
                            Icon(
                                imageVector = Icons.Default.ArrowDropDown,
                                contentDescription = null,
                                tint = NeonCyan,
                                modifier = Modifier.size(18.dp)
                            )
                        }
                    }

                    DropdownMenu(
                        expanded = modelMenuExpanded,
                        onDismissRequest = { modelMenuExpanded = false },
                        modifier = Modifier.background(CyberDarkCard)
                    ) {
                        uiState.availableModels.forEach { model ->
                            DropdownMenuItem(
                                text = {
                                    Column {
                                        Text(
                                            text = model,
                                            fontSize = 13.sp,
                                            fontWeight = if (model == uiState.selectedModel) FontWeight.Bold else FontWeight.Normal,
                                            color = if (model == uiState.selectedModel) NeonCyan else TextPrimaryDark
                                        )
                                        Text(
                                            text = when {
                                                model.contains("deepseek") -> "Groq DeepSeek R1 Reasoning"
                                                model.contains("8b") -> "Groq Ultra-Instant Latency"
                                                model.contains("mixtral") -> "Groq Mixture-of-Experts"
                                                else -> "Groq Flagship Intelligence"
                                            },
                                            fontSize = 10.sp,
                                            color = TextMutedDark
                                        )
                                    }
                                },
                                onClick = {
                                    viewModel.setModel(model)
                                    modelMenuExpanded = false
                                }
                            )
                        }
                    }
                }

                // New Chat Button
                IconButton(
                    onClick = { viewModel.createNewSession() },
                    modifier = Modifier
                        .size(36.dp)
                        .clip(CircleShape)
                        .background(CyberDarkSurfaceVariant)
                        .testTag("new_chat_btn")
                ) {
                    Icon(
                        imageVector = Icons.Default.Add,
                        contentDescription = "New Chat",
                        tint = CyberGold,
                        modifier = Modifier.size(20.dp)
                    )
                }
            }
        }

        // Messages List
        Box(modifier = Modifier.weight(1f)) {
            if (messages.isEmpty()) {
                // Empty state greeting
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(24.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center
                ) {
                    NandiLogo(size = 64.dp, showText = false)
                    Spacer(modifier = Modifier.height(16.dp))
                    Text(
                        text = "How can NandiAi help you today?",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        text = "Ask questions, generate charts, write code, or explore ideas with multi-model intelligence.",
                        fontSize = 12.sp,
                        color = TextSecondaryDark,
                        textAlign = androidx.compose.ui.text.style.TextAlign.Center
                    )

                    Spacer(modifier = Modifier.height(20.dp))

                    // Suggestion Chips
                    val suggestions = listOf(
                        "Create a quarterly growth chart",
                        "Write a Kotlin coroutine worker",
                        "Summarize futuristic AI trends"
                    )
                    suggestions.forEach { suggestion ->
                        Surface(
                            shape = RoundedCornerShape(12.dp),
                            color = CyberDarkCard,
                            border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFF1E2D4A)),
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 4.dp)
                                .clickable {
                                    viewModel.setInputText(suggestion)
                                    viewModel.sendMessage()
                                }
                        ) {
                            Row(
                                modifier = Modifier.padding(12.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Icon(
                                    imageVector = Icons.Default.AutoAwesome,
                                    contentDescription = null,
                                    tint = NeonCyan,
                                    modifier = Modifier.size(16.dp)
                                )
                                Spacer(modifier = Modifier.width(8.dp))
                                Text(
                                    text = suggestion,
                                    fontSize = 12.sp,
                                    color = TextPrimaryDark
                                )
                            }
                        }
                    }
                }
            } else {
                LazyColumn(
                    state = listState,
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(horizontal = 14.dp, vertical = 8.dp),
                    verticalArrangement = Arrangement.spacedBy(14.dp)
                ) {
                    items(messages) { message ->
                        ChatMessageItem(
                            message = message,
                            onSpeak = { viewModel.speakText(message.content) },
                            onRegenerate = { viewModel.regenerateLastMessage() }
                        )
                    }

                    if (uiState.isGenerating) {
                        item {
                            ThinkingBubble()
                        }
                    }

                    item {
                        Spacer(modifier = Modifier.height(10.dp))
                    }
                }
            }
        }

        // Error message pill
        AnimatedVisibility(visible = uiState.errorMessage != null) {
            uiState.errorMessage?.let { error ->
                Surface(
                    color = CyberRed.copy(alpha = 0.15f),
                    border = androidx.compose.foundation.BorderStroke(1.dp, CyberRed.copy(alpha = 0.5f)),
                    shape = RoundedCornerShape(8.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp, vertical = 4.dp)
                ) {
                    Text(
                        text = error,
                        fontSize = 11.sp,
                        color = CyberRed,
                        modifier = Modifier.padding(8.dp)
                    )
                }
            }
        }

        // Input Composer
        Surface(
            color = CyberDarkSurface,
            border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFF1E2D4A)),
            modifier = Modifier
                .fillMaxWidth()
                .imePadding()
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 10.dp, vertical = 8.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Voice Mic Button
                IconButton(
                    onClick = {
                        if (isListening) viewModel.stopVoiceInput() else viewModel.startVoiceInput()
                    },
                    modifier = Modifier
                        .size(40.dp)
                        .clip(CircleShape)
                        .background(if (isListening) CyberRed.copy(alpha = 0.2f) else CyberDarkSurfaceVariant)
                        .testTag("voice_mic_btn")
                ) {
                    Icon(
                        imageVector = if (isListening) Icons.Default.MicOff else Icons.Default.Mic,
                        contentDescription = "Voice Input",
                        tint = if (isListening) CyberRed else NeonCyan,
                        modifier = Modifier.size(20.dp)
                    )
                }

                Spacer(modifier = Modifier.width(6.dp))

                // Text Input
                OutlinedTextField(
                    value = uiState.inputText,
                    onValueChange = { viewModel.setInputText(it) },
                    placeholder = {
                        Text(
                            text = if (isListening) "Listening..." else "Message NandiAi...",
                            fontSize = 13.sp,
                            color = TextMutedDark
                        )
                    },
                    modifier = Modifier
                        .weight(1f)
                        .testTag("chat_input_field"),
                    shape = RoundedCornerShape(24.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = NeonCyan,
                        unfocusedBorderColor = Color(0xFF1E2D4A),
                        focusedTextColor = TextPrimaryDark,
                        unfocusedTextColor = TextPrimaryDark,
                        cursorColor = NeonCyan
                    ),
                    maxLines = 4,
                    keyboardOptions = KeyboardOptions(imeAction = ImeAction.Send),
                    keyboardActions = KeyboardActions(onSend = { viewModel.sendMessage() })
                )

                Spacer(modifier = Modifier.width(6.dp))

                // Send Button
                IconButton(
                    onClick = { viewModel.sendMessage() },
                    enabled = uiState.inputText.isNotBlank() && !uiState.isGenerating,
                    modifier = Modifier
                        .size(42.dp)
                        .clip(CircleShape)
                        .background(
                            if (uiState.inputText.isNotBlank() && !uiState.isGenerating)
                                Brush.linearGradient(listOf(NeonCyan, NeonCyanDark))
                            else
                                Brush.linearGradient(listOf(Color(0xFF1E2D4A), Color(0xFF1E2D4A)))
                        )
                        .testTag("send_message_btn")
                ) {
                    if (uiState.isGenerating) {
                        CircularProgressIndicator(
                            modifier = Modifier.size(18.dp),
                            color = NeonCyan,
                            strokeWidth = 2.dp
                        )
                    } else {
                        Icon(
                            imageVector = Icons.Default.Send,
                            contentDescription = "Send",
                            tint = if (uiState.inputText.isNotBlank()) Color(0xFF041E34) else TextMutedDark,
                            modifier = Modifier.size(18.dp)
                        )
                    }
                }
            }
        }
        Spacer(modifier = Modifier.height(56.dp)) // Nav bar offset
    }
}

@Composable
fun ChatMessageItem(
    message: ChatMessageEntity,
    onSpeak: () -> Unit,
    onRegenerate: () -> Unit
) {
    val isUser = message.role == "user"
    val clipboardManager = LocalClipboardManager.current
    val timeFormat = remember { SimpleDateFormat("HH:mm", Locale.getDefault()) }

    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = if (isUser) Arrangement.End else Arrangement.Start
    ) {
        if (!isUser) {
            Box(
                modifier = Modifier
                    .size(28.dp)
                    .clip(CircleShape)
                    .background(Color(0xFF0A1B30))
                    .border(1.dp, NeonCyan.copy(alpha = 0.5f), CircleShape),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.Default.SmartToy,
                    contentDescription = "AI",
                    tint = NeonCyan,
                    modifier = Modifier.size(16.dp)
                )
            }
            Spacer(modifier = Modifier.width(8.dp))
        }

        Column(modifier = Modifier.fillMaxWidth(if (isUser) 0.85f else 0.92f)) {
            Surface(
                shape = RoundedCornerShape(
                    topStart = 16.dp,
                    topEnd = 16.dp,
                    bottomStart = if (isUser) 16.dp else 4.dp,
                    bottomEnd = if (isUser) 4.dp else 16.dp
                ),
                color = if (isUser) Color(0xFF003852) else CyberDarkCard,
                border = androidx.compose.foundation.BorderStroke(
                    1.dp,
                    if (isUser) NeonCyan.copy(alpha = 0.4f) else Color(0xFF1E2D4A)
                )
            ) {
                Column(modifier = Modifier.padding(12.dp)) {
                    // Message Header
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = if (isUser) "You" else "NandiAi (${message.modelUsed})",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = if (isUser) CyberGold else NeonCyan
                        )

                        Text(
                            text = timeFormat.format(Date(message.timestamp)),
                            fontSize = 9.sp,
                            color = TextMutedDark
                        )
                    }

                    Spacer(modifier = Modifier.height(6.dp))

                    // Parse Content for Code Blocks or regular text
                    val content = message.content
                    if (content.contains("```")) {
                        RenderFormattedMarkdown(content)
                    } else {
                        Text(
                            text = content,
                            fontSize = 13.sp,
                            lineHeight = 19.sp,
                            color = TextPrimaryDark
                        )
                    }
                }
            }

            // Action row under AI message
            if (!isUser) {
                Row(
                    modifier = Modifier.padding(top = 4.dp),
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    IconButton(
                        onClick = { clipboardManager.setText(AnnotatedString(message.content)) },
                        modifier = Modifier.size(24.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.ContentCopy,
                            contentDescription = "Copy",
                            tint = TextMutedDark,
                            modifier = Modifier.size(13.dp)
                        )
                    }

                    IconButton(
                        onClick = onSpeak,
                        modifier = Modifier.size(24.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.VolumeUp,
                            contentDescription = "Speak",
                            tint = TextMutedDark,
                            modifier = Modifier.size(13.dp)
                        )
                    }

                    IconButton(
                        onClick = onRegenerate,
                        modifier = Modifier.size(24.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.Refresh,
                            contentDescription = "Regenerate",
                            tint = TextMutedDark,
                            modifier = Modifier.size(13.dp)
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun RenderFormattedMarkdown(text: String) {
    val segments = text.split("```")
    Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
        segments.forEachIndexed { index, segment ->
            if (index % 2 == 1) {
                // Code block
                val firstLineEnd = segment.indexOf('\n')
                val language = if (firstLineEnd > 0) segment.substring(0, firstLineEnd).trim() else "code"
                val code = if (firstLineEnd > 0) segment.substring(firstLineEnd + 1).trim() else segment.trim()
                CodeHighlightBlock(code = code, language = if (language.isNotBlank()) language else "kotlin")
            } else if (segment.isNotBlank()) {
                Text(
                    text = segment.trim(),
                    fontSize = 13.sp,
                    lineHeight = 19.sp,
                    color = TextPrimaryDark
                )
            }
        }
    }
}

@Composable
fun ThinkingBubble() {
    val infiniteTransition = rememberInfiniteTransition(label = "thinking")
    val alpha by infiniteTransition.animateFloat(
        initialValue = 0.3f,
        targetValue = 1f,
        animationSpec = infiniteRepeatable(
            animation = tween(600),
            repeatMode = RepeatMode.Reverse
        ),
        label = "thinkAlpha"
    )

    Row(
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(8.dp),
        modifier = Modifier.padding(vertical = 6.dp)
    ) {
        Box(
            modifier = Modifier
                .size(26.dp)
                .clip(CircleShape)
                .background(Color(0xFF0A1B30))
                .border(1.dp, NeonCyan.copy(alpha = 0.5f), CircleShape),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                imageVector = Icons.Default.SmartToy,
                contentDescription = null,
                tint = NeonCyan,
                modifier = Modifier.size(14.dp)
            )
        }

        Surface(
            shape = RoundedCornerShape(12.dp),
            color = CyberDarkCard,
            border = androidx.compose.foundation.BorderStroke(1.dp, NeonCyan.copy(alpha = 0.3f))
        ) {
            Row(
                modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                Text(
                    text = "NandiAi is reasoning",
                    fontSize = 11.sp,
                    color = NeonCyan.copy(alpha = alpha),
                    fontWeight = FontWeight.Medium
                )
                Box(modifier = Modifier.size(6.dp).clip(CircleShape).background(NeonCyan.copy(alpha = alpha)))
            }
        }
    }
}
