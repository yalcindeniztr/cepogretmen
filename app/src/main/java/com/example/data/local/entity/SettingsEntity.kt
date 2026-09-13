package com.example.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "settings")
data class SettingsEntity(
    @PrimaryKey val id: Int = 1,
    val schoolName: String,
    val teacherName: String,
    val principalName: String,
    val academicYear: String
)
