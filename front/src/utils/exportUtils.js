// This utility file provides functions to export saved words and subtitles in different formats

/**
 * Formats a timestamp in SRT format (hh:mm:ss,ms)
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted timestamp
 */
export const formatSrtTimestamp = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')},${ms.toString().padStart(3, '0')}`;
};

/**
 * Formats a timestamp in VTT format (hh:mm:ss.ms)
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted timestamp
 */
export const formatVttTimestamp = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
};

/**
 * Converts subtitles to SRT format
 * @param {Object} subtitles - Subtitles object with segments
 * @returns {string} SRT formatted string
 */
export const exportToSRT = (subtitles) => {
  if (!subtitles || !subtitles.segments || !subtitles.segments.length) return '';
  
  let srtContent = '';
  
  subtitles.segments.forEach((segment, index) => {
    // Add index
    srtContent += `${index + 1}\n`;
    
    // Add timestamps
    srtContent += `${formatSrtTimestamp(segment.start)} --> ${formatSrtTimestamp(segment.end)}\n`;
    
    // Add text and empty line
    srtContent += `${segment.text}\n\n`;
  });
  
  return srtContent;
};

/**
 * Converts subtitles to VTT format
 * @param {Object} subtitles - Subtitles object with segments
 * @returns {string} VTT formatted string
 */
export const exportToVTT = (subtitles) => {
  if (!subtitles || !subtitles.segments || !subtitles.segments.length) return '';
  
  let vttContent = 'WEBVTT\n\n';
  
  subtitles.segments.forEach((segment, index) => {
    // Add index as a comment (optional)
    vttContent += `${index + 1}\n`;
    
    // Add timestamps
    vttContent += `${formatVttTimestamp(segment.start)} --> ${formatVttTimestamp(segment.end)}\n`;
    
    // Add text and empty line
    vttContent += `${segment.text}\n\n`;
  });
  
  return vttContent;
};

/**
 * Converts saved words to CSV format
 * @param {Array} savedWords - Array of saved word objects
 * @returns {string} CSV formatted string
 */
export const exportToCSV = (savedWords) => {
  if (!savedWords || !savedWords.length) return '';
  
  // Headers for CSV
  const headers = ['Word', 'Definition', 'Part of Speech', 'Pronunciation', 'Example'];
  
  // Get the data rows
  const rows = savedWords.map(item => {
    const definition = item.definition?.meanings?.[0]?.definitions?.[0]?.definition || '';
    const partOfSpeech = item.definition?.meanings?.[0]?.partOfSpeech || '';
    const pronunciation = item.definition?.phonetics?.[0]?.text || '';
    const example = item.definition?.meanings?.[0]?.definitions?.[0]?.example || '';
    
    return [
      item.word,
      definition.replace(/,/g, ' ').replace(/"/g, '""'), // Handle commas and quotes in CSV
      partOfSpeech,
      pronunciation,
      example.replace(/,/g, ' ').replace(/"/g, '""') // Handle commas and quotes in CSV
    ];
  });
  
  // Convert to CSV format
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');
  
  return csvContent;
};

/**
 * Converts saved words to JSON format
 * @param {Array} savedWords - Array of saved word objects
 * @returns {string} JSON formatted string
 */
export const exportToJSON = (savedWords) => {
  if (!savedWords || !savedWords.length) return '';
  
  // Create a simplified structure for export
  const exportData = savedWords.map(item => {
    const simplifiedItem = {
      word: item.word,
      phonetic: item.definition?.phonetics?.[0]?.text || '',
      audio: item.definition?.phonetics?.[0]?.audio || '',
      meanings: []
    };
    
    // Add all meanings
    if (item.definition?.meanings) {
      simplifiedItem.meanings = item.definition.meanings.map(meaning => ({
        partOfSpeech: meaning.partOfSpeech,
        definitions: meaning.definitions.map(def => ({
          definition: def.definition,
          example: def.example || ''
        })),
        synonyms: meaning.synonyms || []
      }));
    }
    
    return simplifiedItem;
  });
  
  return JSON.stringify(exportData, null, 2);
};

/**
 * Converts saved words to Anki flashcard format
 * Compatible with Anki's import feature
 * @param {Array} savedWords - Array of saved word objects
 * @returns {string} Anki formatted string (tab-separated)
 */
export const exportToAnki = (savedWords) => {
  if (!savedWords || !savedWords.length) return '';
  
  // Each line follows format: word\tdefinition\texample
  const lines = savedWords.map(item => {
    const definition = item.definition?.meanings?.[0]?.definitions?.[0]?.definition || '';
    const example = item.definition?.meanings?.[0]?.definitions?.[0]?.example || '';
    
    // Create a basic HTML format for Anki cards
    return `${item.word}\t${definition}\t${example}`;
  });
  
  return lines.join('\n');
};

/**
 * Generates a downloadable file with the given content
 * @param {string} content - Content to save in the file
 * @param {string} fileName - Name of the file
 * @param {string} contentType - MIME type of the file
 */
export const downloadFile = (content, fileName, contentType) => {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
};
