package com.example.presentation.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import androidx.room.Room
import com.example.data.local.AppDatabase
import com.example.data.local.entity.PlanEntity
import com.example.data.local.entity.PlanType
import com.example.data.local.entity.SettingsEntity
import com.example.data.local.entity.TextbookEntity
import com.example.data.repository.AppRepository
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

class MainViewModel(application: Application) : AndroidViewModel(application) {
    private val database = Room.databaseBuilder(
        application,
        AppDatabase::class.java,
        "maarif_database"
    )
    .fallbackToDestructiveMigration()
    .build()

    private val repository = AppRepository(database.appDao())

    val settings: StateFlow<SettingsEntity?> = repository.settings
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), null)

    val textbooks: StateFlow<List<TextbookEntity>> = repository.textbooks
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val yearlyPlans: StateFlow<List<PlanEntity>> = repository.yearlyPlans
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val dailyPlans: StateFlow<List<PlanEntity>> = repository.dailyPlans
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())
        
    val libraryItems: StateFlow<List<com.example.data.local.entity.LibraryItemEntity>> = repository.libraryItems
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    fun saveSettings(schoolName: String, teacherName: String, principalName: String, academicYear: String) {
        viewModelScope.launch {
            repository.saveSettings(
                SettingsEntity(
                    id = 1,
                    schoolName = schoolName,
                    teacherName = teacherName,
                    principalName = principalName,
                    academicYear = academicYear
                )
            )
        }
    }

    fun addTextbook(gradeLevel: Int, title: String, author: String, publisher: String) {
        viewModelScope.launch {
            repository.insertTextbook(
                TextbookEntity(
                    gradeLevel = gradeLevel,
                    title = title,
                    author = author,
                    publisher = publisher
                )
            )
        }
    }

    fun addPlan(
        type: PlanType,
        gradeLevel: Int,
        title: String,
        weekNumber: Int,
        dateRange: String,
        outcomes: String,
        values: String,
        learningProcesses: String,
        evaluation: String,
        resources: String
    ) {
        viewModelScope.launch {
            repository.insertPlan(
                PlanEntity(
                    type = type,
                    gradeLevel = gradeLevel,
                    title = title,
                    weekNumber = weekNumber,
                    dateRange = dateRange,
                    outcomes = outcomes,
                    values = values,
                    learningProcesses = learningProcesses,
                    evaluation = evaluation,
                    resources = resources
                )
            )
        }
    }

    fun deletePlan(id: Int) {
        viewModelScope.launch {
            repository.deletePlan(id)
        }
    }
    
    fun addLibraryItem(title: String, type: com.example.data.local.entity.LibraryItemType, content: String) {
        viewModelScope.launch {
            repository.insertLibraryItem(
                com.example.data.local.entity.LibraryItemEntity(
                    title = title,
                    type = type,
                    content = content
                )
            )
        }
    }
    
    fun deleteLibraryItem(id: Int) {
        viewModelScope.launch {
            repository.deleteLibraryItem(id)
        }
    }
    
    fun generateAIPlan(
        gradeLevel: String,
        unitTitle: String,
        outcome: String,
        dateRange: String,
        planType: String,
        onSuccess: (values: String, processes: String, evaluation: String, resources: String) -> Unit,
        onError: (String) -> Unit
    ) {
        viewModelScope.launch {
            try {
                val prompt = """
                    Sen Türkiye Yüzyılı Maarif Modeline uygun bir Tarih öğretmeni ve ders planlayıcısısın.
                    Şu parametrelere göre bir $planType hazırlamanı istiyorum:
                    Sınıf Düzeyi: $gradeLevel. Sınıf
                    Ünite/Konu: $unitTitle
                    Kazanım: $outcome
                    Tarih/Hafta: $dateRange
                    
                    Lütfen sadece aşağıdaki 4 bölümün içeriğini (başlık kullanmadan) belirterek, 
                    her bölüm arasında '|||' (üç boru) karakteri koyarak cevap ver. Başka hiçbir açıklama ekleme.
                    Format şu şekilde olmalıdır:
                    [Değerler ve Sosyal Etkinlik İçeriği]|||[Öğrenme Süreçleri İçeriği]|||[Değerlendirme İçeriği]|||[Kaynaklar (MEB, EBA, OGM) İçeriği]
                    
                    İçerikler Maarif modelinin ruhuna, etkinlik temelli öğrenmeye ve kazanıma tam uygun olmalıdır.
                """.trimIndent()

                val request = com.example.util.GenerateContentRequest(
                    contents = listOf(com.example.util.Content(parts = listOf(com.example.util.Part(text = prompt))))
                )
                
                val response = com.example.util.RetrofitClient.service.generateContent(com.example.BuildConfig.GEMINI_API_KEY, request)
                val responseText = response.candidates.firstOrNull()?.content?.parts?.firstOrNull()?.text ?: ""
                
                val parts = responseText.split("|||")
                if (parts.size >= 4) {
                    onSuccess(parts[0].trim(), parts[1].trim(), parts[2].trim(), parts[3].trim())
                } else {
                    onError("Yapay zeka beklenen formatta cevap vermedi.")
                }
            } catch (e: Exception) {
                onError(e.message ?: "Bilinmeyen bir hata oluştu.")
            }
        }
    }
}
