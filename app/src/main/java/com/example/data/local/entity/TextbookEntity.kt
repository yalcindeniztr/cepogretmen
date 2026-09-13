package com.example.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "textbooks")
data class TextbookEntity(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val gradeLevel: Int, // 9, 10, 11, 12
    val title: String,
    val author: String,
    val publisher: String
)
