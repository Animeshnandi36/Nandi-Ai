package com.example.ui.components

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.ContentCopy
import androidx.compose.material.icons.filled.Code
import androidx.compose.material.icons.filled.Folder
import androidx.compose.material.icons.filled.GraphicEq
import androidx.compose.material.icons.filled.Image
import androidx.compose.material.icons.filled.Mic
import androidx.compose.material.icons.filled.MicOff
import androidx.compose.material.icons.filled.PieChart
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material.icons.filled.SmartToy
import androidx.compose.material.icons.filled.VolumeUp
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalClipboardManager
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.R
import com.example.ui.theme.CyberDarkCard
import com.example.ui.theme.CyberDarkSurface
import com.example.ui.theme.CyberDarkSurfaceVariant
import com.example.ui.theme.CyberGold
import com.example.ui.theme.CyberGreen
import com.example.ui.theme.CyberPurple
import com.example.ui.theme.NeonCyan
import com.example.ui.theme.NeonCyanDark
import com.example.ui.theme.TextMutedDark
import com.example.ui.theme.TextPrimaryDark
import com.example.ui.theme.TextSecondaryDark

@Composable
fun NandiLogo(
    modifier: Modifier = Modifier,
    size: Dp = 36.dp,
    showText: Boolean = true
) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(8.dp),
        modifier = modifier
    ) {
        Image(
            painter = painterResource(id = R.drawable.ic_nandi_ai_emblem),
            contentDescription = "NandiAi Official Logo Emblem",
            modifier = Modifier.size(size)
        )

        if (showText) {
            Column {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = "NANDI",
                        fontSize = (size.value * 0.42f).coerceAtLeast(14f).sp,
                        fontWeight = FontWeight.Black,
                        letterSpacing = 1.sp,
                        color = Color.White
                    )
                    Spacer(modifier = Modifier.width(3.dp))
                    Text(
                        text = "AI",
                        fontSize = (size.value * 0.42f).coerceAtLeast(14f).sp,
                        fontWeight = FontWeight.Black,
                        letterSpacing = 1.sp,
                        color = NeonCyan
                    )
                }
                Text(
                    text = "BY ANIMESH NANDI",
                    fontSize = 8.sp,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 1.5.sp,
                    color = CyberGold
                )
            }
        }
    }
}

@Composable
fun NandiFooter(modifier: Modifier = Modifier) {
    Column(
        modifier = modifier
            .fillMaxWidth()
            .padding(vertical = 12.dp, horizontal = 16.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = "© 2026 NandiAi · Developed by Animesh Nandi",
            fontSize = 11.sp,
            fontWeight = FontWeight.Medium,
            color = TextMutedDark,
            textAlign = TextAlign.Center
        )
    }
}

@Composable
fun StatusBadge(
    title: String,
    statusText: String,
    isActive: Boolean,
    modifier: Modifier = Modifier
) {
    val infiniteTransition = rememberInfiniteTransition(label = "pulse")
    val alpha by infiniteTransition.animateFloat(
        initialValue = 0.4f,
        targetValue = 1f,
        animationSpec = infiniteRepeatable(
            animation = tween(1200),
            repeatMode = RepeatMode.Reverse
        ),
        label = "pulseAlpha"
    )

    Surface(
        shape = RoundedCornerShape(10.dp),
        color = CyberDarkSurfaceVariant.copy(alpha = 0.8f),
        border = androidx.compose.foundation.BorderStroke(1.dp, if (isActive) NeonCyan.copy(alpha = 0.3f) else Color.Gray.copy(alpha = 0.2f)),
        modifier = modifier
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp)
        ) {
            Box(
                modifier = Modifier
                    .size(8.dp)
                    .clip(CircleShape)
                    .background(
                        if (isActive) CyberGreen.copy(alpha = alpha) else Color.Gray
                    )
            )
            Column {
                Text(
                    text = title,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold,
                    color = TextPrimaryDark
                )
                Text(
                    text = statusText,
                    fontSize = 10.sp,
                    color = if (isActive) CyberGreen else TextMutedDark
                )
            }
        }
    }
}

@Composable
fun CodeHighlightBlock(
    code: String,
    language: String = "kotlin",
    modifier: Modifier = Modifier
) {
    val clipboardManager = LocalClipboardManager.current
    var copied by remember { mutableStateOf(false) }

    Surface(
        shape = RoundedCornerShape(12.dp),
        color = Color(0xFF070E1A),
        border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFF1E2D4A)),
        modifier = modifier.fillMaxWidth()
    ) {
        Column {
            // Header
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(Color(0xFF0F1A2E))
                    .padding(horizontal = 12.dp, vertical = 6.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    Box(modifier = Modifier.size(8.dp).clip(CircleShape).background(Color(0xFFFF5F56)))
                    Box(modifier = Modifier.size(8.dp).clip(CircleShape).background(Color(0xFFFFBD2E)))
                    Box(modifier = Modifier.size(8.dp).clip(CircleShape).background(Color(0xFF27C93F)))
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = language.uppercase(),
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        fontFamily = FontFamily.Monospace,
                        color = NeonCyan
                    )
                }

                IconButton(
                    onClick = {
                        clipboardManager.setText(AnnotatedString(code))
                        copied = true
                    },
                    modifier = Modifier.size(28.dp).testTag("copy_code_btn")
                ) {
                    Icon(
                        imageVector = if (copied) Icons.Default.Check else Icons.Default.ContentCopy,
                        contentDescription = "Copy Code",
                        tint = if (copied) CyberGreen else TextSecondaryDark,
                        modifier = Modifier.size(14.dp)
                    )
                }
            }

            // Code lines
            Text(
                text = code,
                fontSize = 12.sp,
                fontFamily = FontFamily.Monospace,
                lineHeight = 18.sp,
                color = Color(0xFFE2E8F0),
                modifier = Modifier.padding(14.dp)
            )
        }
    }
}
