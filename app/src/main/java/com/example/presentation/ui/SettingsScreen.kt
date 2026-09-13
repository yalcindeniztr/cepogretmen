package com.example.presentation.ui

import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.example.presentation.viewmodel.MainViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SettingsScreen(
    viewModel: MainViewModel,
    onNavigateBack: () -> Unit
) {
    val settingsState = viewModel.settings.collectAsStateWithLifecycle().value

    var schoolName by remember { mutableStateOf(settingsState?.schoolName ?: "Ballıca MTAL") }
    var teacherName by remember { mutableStateOf(settingsState?.teacherName ?: "Yalçın DENİZ") }
    var principalName by remember { mutableStateOf(settingsState?.principalName ?: "Fatma Bayram ARSLAN") }
    var academicYear by remember { mutableStateOf(settingsState?.academicYear ?: "2024-2025") }

    LaunchedEffect(settingsState) {
        if (settingsState != null) {
            schoolName = settingsState.schoolName
            teacherName = settingsState.teacherName
            principalName = settingsState.principalName
            academicYear = settingsState.academicYear
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Ayarlar & Bilgiler") },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Geri")
                    }
                }
            )
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            Text("Eğitim Bilgileri", style = MaterialTheme.typography.titleLarge)
            
            OutlinedTextField(
                value = schoolName,
                onValueChange = { schoolName = it },
                label = { Text("Okul Adı") },
                modifier = Modifier.fillMaxWidth()
            )
            
            OutlinedTextField(
                value = teacherName,
                onValueChange = { teacherName = it },
                label = { Text("Öğretmen Adı") },
                modifier = Modifier.fillMaxWidth()
            )
            
            OutlinedTextField(
                value = principalName,
                onValueChange = { principalName = it },
                label = { Text("Müdür Adı") },
                modifier = Modifier.fillMaxWidth()
            )
            
            OutlinedTextField(
                value = academicYear,
                onValueChange = { academicYear = it },
                label = { Text("Eğitim Öğretim Yılı") },
                modifier = Modifier.fillMaxWidth()
            )

            Button(
                onClick = {
                    viewModel.saveSettings(schoolName, teacherName, principalName, academicYear)
                    onNavigateBack()
                },
                modifier = Modifier.fillMaxWidth()
            ) {
                Text("Ayarları Kaydet")
            }
        }
    }
}
