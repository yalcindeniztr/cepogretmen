package com.example.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "plans")
data class PlanEntity(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val type: PlanType, // YEARLY or DAILY
    val gradeLevel: Int, // 9, 10, 11, 12
    val title: String,
    val weekNumber: Int,
    val dateRange: String,
    val outcomes: String, // Kazanımlar
    val values: String, // Değerler
    val learningProcesses: String, // Öğrenme Süreçleri
    val evaluation: String, // Değerlendirme
    val resources: String // MEB, EBA, OGM, vb.
)

enum class PlanType {
    YEARLY, DAILY
}
