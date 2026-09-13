package com.example.presentation.ui

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.example.presentation.viewmodel.MainViewModel
import com.example.util.PdfGenerator

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PlanDetailScreen(
    viewModel: MainViewModel,
    planId: Int,
    onNavigateBack: () -> Unit
) {
    val context = LocalContext.current
    val yearlyPlans = viewModel.yearlyPlans.collectAsStateWithLifecycle().value
    val dailyPlans = viewModel.dailyPlans.collectAsStateWithLifecycle().value
    val settings = viewModel.settings.collectAsStateWithLifecycle().value
    
    val plan = yearlyPlans.find { it.id == planId } ?: dailyPlans.find { it.id == planId }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Plan Detayı") },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Geri")
                    }
                }
            )
        }
    ) { paddingValues ->
        if (plan == null) {
            Box(modifier = Modifier.fillMaxSize().padding(paddingValues), contentAlignment = androidx.compose.ui.Alignment.Center) {
                Text("Plan bulunamadı.")
            }
            return@Scaffold
        }

        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(16.dp)
                .verticalScroll(rememberScrollState()),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            Text(text = "${plan.gradeLevel}. Sınıf - ${plan.title}", style = MaterialTheme.typography.headlineSmall)
            Text(text = "Tarih: ${plan.dateRange} (${plan.weekNumber}. Hafta)", style = MaterialTheme.typography.titleMedium)
            Divider()
            
            Text("Kazanımlar:", style = MaterialTheme.typography.titleMedium)
            Text(plan.outcomes)
            Divider()

            Text("Değerler:", style = MaterialTheme.typography.titleMedium)
            Text(plan.values)
            Divider()

            Text("Öğrenme Süreçleri:", style = MaterialTheme.typography.titleMedium)
            Text(plan.learningProcesses)
            Divider()

            Text("Değerlendirme:", style = MaterialTheme.typography.titleMedium)
            Text(plan.evaluation)
            Divider()

            Text("Kaynaklar:", style = MaterialTheme.typography.titleMedium)
            Text(plan.resources)
            Divider()

            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                Button(
                    onClick = {
                        PdfGenerator.generatePlanPdf(context, plan, settings)
                    },
                    modifier = Modifier.weight(1f)
                ) {
                    Text("PDF Olarak Çıktı Al")
                }
                
                OutlinedButton(
                    onClick = {
                        viewModel.deletePlan(plan.id)
                        onNavigateBack()
                    },
                    modifier = Modifier.weight(1f),
                    colors = ButtonDefaults.outlinedButtonColors(contentColor = MaterialTheme.colorScheme.error)
                ) {
                    Text("Planı Sil")
                }
            }
        }
    }
}
