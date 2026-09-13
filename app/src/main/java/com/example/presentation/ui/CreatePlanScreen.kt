package com.example.presentation.ui

import android.widget.Toast
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
import com.example.data.local.entity.PlanType
import com.example.presentation.viewmodel.MainViewModel
import kotlinx.coroutines.launch

val historyUnits = mapOf(
    "9" to listOf("Tarih ve Zaman", "İnsanlığın İlk Dönemleri", "Orta Çağ'da Dünya", "İlk ve Orta Çağlarda Türk Dünyası", "İslam Medeniyetinin Doğuşu", "Türklerin İslamiyet'i Kabulü"),
    "10" to listOf("Yerleşme ve Devletleşme Sürecinde Selçuklu Türkiyesi", "Beylikten Devlete Osmanlı Siyaseti", "Devletleşme Sürecinde Savaşçılar ve Askerler", "Beylikten Devlete Osmanlı Medeniyeti", "Dünya Gücü Osmanlı", "Sultan ve Osmanlı Merkez Teşkilatı", "Klasik Çağda Osmanlı Toplum Düzeni"),
    "11" to listOf("Değişen Dünya Dengeleri Karşısında Osmanlı Siyaseti", "Değişim Çağında Avrupa ve Osmanlı", "Uluslararası İlişkilerde Denge Stratejisi (1774-1914)", "Devrimler Çağında Değişen Devlet-Toplum İlişkileri", "Sermaye ve Emek", "XIX. ve XX. Yüzyılda Değişen Gündelik Hayat"),
    "12" to listOf("XX. Yüzyıl Başlarında Osmanlı Devleti ve Dünya", "Milli Mücadele", "Atatürkçülük ve Türk İnkılabı", "İki Savaş Arasındaki Dönemde Türkiye ve Dünya", "II. Dünya Savaşı Sürecinde Türkiye ve Dünya", "II. Dünya Savaşı Sonrasında Türkiye ve Dünya")
)

val historyOutcomes = listOf(
    "Öğrenciler tarihi olayları analiz eder.",
    "Olaylar arasında neden-sonuç ilişkisi kurar.",
    "Tarihi kanıtları yorumlayarak çıkarımda bulunur.",
    "Maarif modeli değerlerini tarihi şahsiyetler üzerinden kavrar.",
    "Değişim ve sürekliliği fark eder.",
    "Tarihsel empati kurar."
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CreatePlanScreen(
    viewModel: MainViewModel,
    planType: PlanType,
    onNavigateBack: () -> Unit
) {
    val context = LocalContext.current
    val titleStr = if (planType == PlanType.YEARLY) "Yıllık Plan Ekle" else "Günlük Plan Ekle"
    
    var gradeLevel by remember { mutableStateOf("9") }
    var title by remember { mutableStateOf(historyUnits["9"]?.first() ?: "") }
    var weekNumber by remember { mutableStateOf("1") }
    var dateRange by remember { mutableStateOf("") }
    var outcomes by remember { mutableStateOf(historyOutcomes.first()) }
    var values by remember { mutableStateOf("") }
    var learningProcesses by remember { mutableStateOf("") }
    var evaluation by remember { mutableStateOf("") }
    var resources by remember { mutableStateOf("") }
    
    var isGenerating by remember { mutableStateOf(false) }
    
    var gradeExpanded by remember { mutableStateOf(false) }
    var unitExpanded by remember { mutableStateOf(false) }
    var outcomeExpanded by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(titleStr) },
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
                .padding(16.dp)
                .verticalScroll(rememberScrollState()),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Grade Dropdown
            ExposedDropdownMenuBox(expanded = gradeExpanded, onExpandedChange = { gradeExpanded = it }) {
                OutlinedTextField(
                    value = "$gradeLevel. Sınıf", onValueChange = {}, readOnly = true,
                    label = { Text("Sınıf Seçimi") }, modifier = Modifier.fillMaxWidth().menuAnchor(),
                    trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = gradeExpanded) }
                )
                ExposedDropdownMenu(expanded = gradeExpanded, onDismissRequest = { gradeExpanded = false }) {
                    listOf("9", "10", "11", "12").forEach { grade ->
                        DropdownMenuItem(text = { Text("$grade. Sınıf") }, onClick = {
                            gradeLevel = grade
                            title = historyUnits[grade]?.first() ?: ""
                            gradeExpanded = false
                        })
                    }
                }
            }
            
            // Unit Dropdown
            ExposedDropdownMenuBox(expanded = unitExpanded, onExpandedChange = { unitExpanded = it }) {
                OutlinedTextField(
                    value = title, onValueChange = {}, readOnly = true,
                    label = { Text("Ünite/Konu Seçimi") }, modifier = Modifier.fillMaxWidth().menuAnchor(),
                    trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = unitExpanded) }
                )
                ExposedDropdownMenu(expanded = unitExpanded, onDismissRequest = { unitExpanded = false }) {
                    historyUnits[gradeLevel]?.forEach { unit ->
                        DropdownMenuItem(text = { Text(unit) }, onClick = {
                            title = unit
                            unitExpanded = false
                        })
                    }
                }
            }
            
            // Outcome Dropdown
            ExposedDropdownMenuBox(expanded = outcomeExpanded, onExpandedChange = { outcomeExpanded = it }) {
                OutlinedTextField(
                    value = outcomes, onValueChange = {}, readOnly = true,
                    label = { Text("Kazanım Seçimi") }, modifier = Modifier.fillMaxWidth().menuAnchor(),
                    trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = outcomeExpanded) }
                )
                ExposedDropdownMenu(expanded = outcomeExpanded, onDismissRequest = { outcomeExpanded = false }) {
                    historyOutcomes.forEach { outcome ->
                        DropdownMenuItem(text = { Text(outcome) }, onClick = {
                            outcomes = outcome
                            outcomeExpanded = false
                        })
                    }
                }
            }

            OutlinedTextField(value = dateRange, onValueChange = { dateRange = it }, label = { Text("Tarih Aralığı (Örn: 15-19 Eylül)") }, modifier = Modifier.fillMaxWidth())
            OutlinedTextField(value = weekNumber, onValueChange = { weekNumber = it }, label = { Text("Hafta Numarası") }, modifier = Modifier.fillMaxWidth())

            Button(
                onClick = {
                    if (dateRange.isBlank()) {
                        Toast.makeText(context, "Lütfen Tarih Aralığı giriniz.", Toast.LENGTH_SHORT).show()
                        return@Button
                    }
                    isGenerating = true
                    viewModel.generateAIPlan(
                        gradeLevel = gradeLevel,
                        unitTitle = title,
                        outcome = outcomes,
                        dateRange = dateRange,
                        planType = if(planType == PlanType.YEARLY) "Yıllık Plan" else "Günlük Ders Planı",
                        onSuccess = { v, p, e, r ->
                            values = v
                            learningProcesses = p
                            evaluation = e
                            resources = r
                            isGenerating = false
                        },
                        onError = { err ->
                            isGenerating = false
                            Toast.makeText(context, "Hata: $err", Toast.LENGTH_LONG).show()
                        }
                    )
                },
                modifier = Modifier.fillMaxWidth(),
                colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.secondary)
            ) {
                if (isGenerating) {
                    CircularProgressIndicator(color = MaterialTheme.colorScheme.onSecondary, modifier = Modifier.size(24.dp))
                } else {
                    Text("Yapay Zeka ile Oluştur (Maarif Modeli)")
                }
            }

            OutlinedTextField(value = values, onValueChange = { values = it }, label = { Text("Değerler (Sosyal Etkinlik)") }, modifier = Modifier.fillMaxWidth(), minLines = 2)
            OutlinedTextField(value = learningProcesses, onValueChange = { learningProcesses = it }, label = { Text("Öğrenme Süreçleri") }, modifier = Modifier.fillMaxWidth(), minLines = 2)
            OutlinedTextField(value = evaluation, onValueChange = { evaluation = it }, label = { Text("Değerlendirme") }, modifier = Modifier.fillMaxWidth(), minLines = 2)
            OutlinedTextField(value = resources, onValueChange = { resources = it }, label = { Text("Kaynaklar (MEB, EBA, OGM)") }, modifier = Modifier.fillMaxWidth(), minLines = 2)

            Button(
                onClick = {
                    viewModel.addPlan(
                        type = planType,
                        gradeLevel = gradeLevel.toIntOrNull() ?: 9,
                        title = title,
                        weekNumber = weekNumber.toIntOrNull() ?: 1,
                        dateRange = dateRange,
                        outcomes = outcomes,
                        values = values,
                        learningProcesses = learningProcesses,
                        evaluation = evaluation,
                        resources = resources
                    )
                    onNavigateBack()
                },
                modifier = Modifier.fillMaxWidth()
            ) {
                Text("Planı Kaydet")
            }
        }
    }
}
