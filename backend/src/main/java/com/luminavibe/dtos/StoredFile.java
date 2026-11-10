package com.luminavibe.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StoredFile {
    private String filename;
    private String contentType;
    private byte[] data;
}

