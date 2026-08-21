package com.example.ui.screens.image

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Download
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.FavoriteBorder
import androidx.compose.material.icons.filled.Share
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.example.R
import com.example.ui.components.NandiFooter
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

val stylePresets = listOf(
    "Futuristic Cyber" to "Cyberpunk neon aesthetic with holographic reflections",
    "Cinematic 3D" to "Octane render, photorealistic cinematic lighting 8k",
    "Anime Cyberpunk" to "Makoto Shinkai anime style with futuristic elements",
    "Digital Art" to "Vibrant digital concept art, trending on ArtStation",
    "Photorealistic" to "Hyperrealistic macro photography, Hasselblad lens"
)

val ratios = listOf("1:1", "16:9", "9:16", "4:3")

@Composable
fun ImageStudioScreen(
    viewModel: ImageViewModel,
    modifier: Modifier = Modifier
) {
    val uiState by viewModel.uiState.collectAsState()
    val savedImages by viewModel.savedImages.collectAsState()

    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .padding(horizontal = 16.dp)
            .testTag("image_studio_screen"),
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
                    border = androidx.compose.foundation.BorderStroke(1.dp, CyberPurple.copy(alpha = 0.5f))
                ) {
                    Text(
                        text = "FLUX.1 Neural Engine",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = CyberPurple,
                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp)
                    )
                }
            }
        }

        // Header Title
        item {
            Column {
                Text(
                    text = "Neural Image Studio",
                    fontSize = 24.sp,
                    fontWeight = FontWeight.Black,
                    color = Color.White
                )
                Text(
                    text = "Transform natural language prompts into stunning visual concepts.",
                    fontSize = 13.sp,
                    color = TextSecondaryDark
                )
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
                        text = "IMAGE PROMPT",
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 1.sp,
                        color = NeonCyan
                    )

                    Spacer(modifier = Modifier.height(8.dp))

                    OutlinedTextField(
                        value = uiState.prompt,
                        onValueChange = { viewModel.setPrompt(it) },
                        placeholder = {
                            Text(
                                "e.g. A cybernetic bull guardian standing on a neon floating island in deep space...",
                                fontSize = 13.sp,
                                color = TextMutedDark
                            )
                        },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(100.dp)
                            .testTag("image_prompt_input"),
                        shape = RoundedCornerShape(12.dp),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = NeonCyan,
                            unfocusedBorderColor = Color(0xFF1E2D4A),
                            focusedTextColor = TextPrimaryDark,
                            unfocusedTextColor = TextPrimaryDark
                        )
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    // Style Presets Carousel
                    Text(
                        text = "ARTISTIC STYLE",
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 1.sp,
                        color = CyberGold
                    )
                    Spacer(modifier = Modifier.height(6.dp))

                    LazyRow(
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        items(stylePresets) { (name, _) ->
                            val isSelected = uiState.selectedStyle == name
                            Surface(
                                shape = RoundedCornerShape(10.dp),
                                color = if (isSelected) CyberPurple.copy(alpha = 0.25f) else CyberDarkSurfaceVariant,
                                border = androidx.compose.foundation.BorderStroke(
                                    1.dp,
                                    if (isSelected) CyberPurple else Color.Transparent
                                ),
                                modifier = Modifier.clickable { viewModel.setStyle(name) }
                            ) {
                                Text(
                                    text = name,
                                    fontSize = 11.sp,
                                    fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                                    color = if (isSelected) Color.White else TextSecondaryDark,
                                    modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp)
                                )
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    // Aspect Ratio Selector
                    Text(
                        text = "ASPECT RATIO",
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 1.sp,
                        color = TextSecondaryDark
                    )
                    Spacer(modifier = Modifier.height(6.dp))

                    Row(
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        ratios.forEach { ratio ->
                            val isSelected = uiState.selectedRatio == ratio
                            Surface(
                                shape = RoundedCornerShape(8.dp),
                                color = if (isSelected) NeonCyan.copy(alpha = 0.2f) else CyberDarkSurfaceVariant,
                                border = androidx.compose.foundation.BorderStroke(
                                    1.dp,
                                    if (isSelected) NeonCyan else Color.Transparent
                                ),
                                modifier = Modifier
                                    .weight(1f)
                                    .clickable { viewModel.setRatio(ratio) }
                            ) {
                                Text(
                                    text = ratio,
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = if (isSelected) NeonCyan else TextMutedDark,
                                    textAlign = androidx.compose.ui.text.style.TextAlign.Center,
                                    modifier = Modifier.padding(vertical = 6.dp)
                                )
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    // Generate Button
                    Button(
                        onClick = { viewModel.generateImage() },
                        enabled = uiState.prompt.isNotBlank() && !uiState.isGenerating,
                        shape = RoundedCornerShape(12.dp),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = NeonCyan,
                            contentColor = Color(0xFF041E34)
                        ),
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(48.dp)
                            .testTag("generate_image_btn")
                    ) {
                        if (uiState.isGenerating) {
                            CircularProgressIndicator(
                                modifier = Modifier.size(20.dp),
                                color = Color(0xFF041E34),
                                strokeWidth = 2.dp
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(text = "Synthesizing Neural Art...", fontWeight = FontWeight.Bold)
                        } else {
                            Icon(
                                imageVector = Icons.Default.AutoAwesome,
                                contentDescription = null,
                                modifier = Modifier.size(18.dp)
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(text = "Generate Artwork", fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }
        }

        // Generating Progress Feedback
        if (uiState.isGenerating) {
            item {
                FuturisticLaserScanner(step = uiState.generationStep)
            }
        }

        // Gallery / Saved Images Section
        item {
            Text(
                text = "SAVED CREATIONS (${savedImages.size})",
                fontSize = 12.sp,
                fontWeight = FontWeight.Bold,
                letterSpacing = 1.sp,
                color = NeonCyan
            )
        }

        if (savedImages.isEmpty() && !uiState.isGenerating) {
            item {
                Surface(
                    shape = RoundedCornerShape(14.dp),
                    color = CyberDarkCard,
                    border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFF1E2D4A)),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(
                        modifier = Modifier.padding(24.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Icon(
                            imageVector = Icons.Default.AutoAwesome,
                            contentDescription = null,
                            tint = TextMutedDark,
                            modifier = Modifier.size(40.dp)
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = "No generated images yet",
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Bold,
                            color = TextPrimaryDark
                        )
                        Text(
                            text = "Type a prompt above to create your first masterpiece.",
                            fontSize = 12.sp,
                            color = TextMutedDark,
                            textAlign = androidx.compose.ui.text.style.TextAlign.Center
                        )
                    }
                }
            }
        } else {
            items(savedImages) { imageItem ->
                SavedImageCard(
                    image = imageItem,
                    onToggleFavorite = { viewModel.toggleFavorite(imageItem) },
                    onDelete = { viewModel.deleteImage(imageItem.id) }
                )
            }
        }

        item {
            NandiFooter()
            Spacer(modifier = Modifier.height(64.dp))
        }
    }
}

@Composable
fun FuturisticLaserScanner(step: String) {
    val infiniteTransition = rememberInfiniteTransition(label = "scanner")
    val laserY by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = 1f,
        animationSpec = infiniteRepeatable(
            animation = tween(1200, easing = LinearEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "laserPos"
    )

    Surface(
        shape = RoundedCornerShape(14.dp),
        color = Color(0xFF091222),
        border = androidx.compose.foundation.BorderStroke(1.dp, NeonCyan.copy(alpha = 0.6f)),
        modifier = Modifier
            .fillMaxWidth()
            .height(200.dp)
    ) {
        Box(modifier = Modifier.fillMaxSize()) {
            // Scanner Laser
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(3.dp)
                    .align(Alignment.TopCenter)
                    .padding(top = (laserY * 180).dp)
                    .background(
                        Brush.horizontalGradient(
                            listOf(Color.Transparent, NeonCyan, CyberGold, NeonCyan, Color.Transparent)
                        )
                    )
            )

            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(16.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.Center
            ) {
                Image(
                    painter = painterResource(id = R.drawable.ic_nandi_ai_emblem),
                    contentDescription = "Nandi AI Neural Synthesizer",
                    modifier = Modifier.size(54.dp)
                )
                Spacer(modifier = Modifier.height(12.dp))
                Text(
                    text = step,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold,
                    color = NeonCyan
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = "Nandi AI FLUX.1 Neural Engine",
                    fontSize = 10.sp,
                    color = TextSecondaryDark
                )
            }
        }
    }
}

@Composable
fun SavedImageCard(
    image: com.example.data.model.GeneratedImageEntity,
    onToggleFavorite: () -> Unit,
    onDelete: () -> Unit
) {
    Surface(
        shape = RoundedCornerShape(14.dp),
        color = CyberDarkCard,
        border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFF1E2D4A)),
        modifier = Modifier.fillMaxWidth()
    ) {
        Column {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(200.dp)
                    .background(Color(0xFF060B14))
            ) {
                AsyncImage(
                    model = image.imageBase64OrUrl,
                    contentDescription = image.prompt,
                    contentScale = ContentScale.Crop,
                    modifier = Modifier.fillMaxSize()
                )

                // Favorite & Delete Controls
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(8.dp),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Surface(
                        shape = RoundedCornerShape(8.dp),
                        color = Color.Black.copy(alpha = 0.6f)
                    ) {
                        Text(
                            text = image.aspectRatio,
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            color = NeonCyan,
                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                        )
                    }

                    Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                        IconButton(
                            onClick = onToggleFavorite,
                            modifier = Modifier
                                .size(32.dp)
                                .clip(CircleShape)
                                .background(Color.Black.copy(alpha = 0.6f))
                        ) {
                            Icon(
                                imageVector = if (image.isFavorite) Icons.Default.Favorite else Icons.Default.FavoriteBorder,
                                contentDescription = "Favorite",
                                tint = if (image.isFavorite) CyberRed else Color.White,
                                modifier = Modifier.size(16.dp)
                            )
                        }

                        IconButton(
                            onClick = onDelete,
                            modifier = Modifier
                                .size(32.dp)
                                .clip(CircleShape)
                                .background(Color.Black.copy(alpha = 0.6f))
                        ) {
                            Icon(
                                imageVector = Icons.Default.Delete,
                                contentDescription = "Delete",
                                tint = Color.White,
                                modifier = Modifier.size(16.dp)
                            )
                        }
                    }
                }
            }

            Column(modifier = Modifier.padding(12.dp)) {
                Text(
                    text = image.prompt,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Medium,
                    color = TextPrimaryDark,
                    maxLines = 2
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = "Model: ${image.modelUsed}",
                    fontSize = 10.sp,
                    color = TextMutedDark
                )
            }
        }
    }
}
