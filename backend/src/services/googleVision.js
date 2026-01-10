const vision = require('@google-cloud/vision');
const path = require('path');

class GoogleVisionService {
  constructor() {
    this.client = new vision.ImageAnnotatorClient({
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
    });
  }

  async detectHandwriting(imagePath) {
    try {
      const [result] = await this.client.documentTextDetection(imagePath);
      const fullTextAnnotation = result.fullTextAnnotation;

      if (!fullTextAnnotation) {
        return {
          success: false,
          error: 'No text detected in the image'
        };
      }

      return {
        success: true,
        text: fullTextAnnotation.text,
        confidence: this.calculateAverageConfidence(fullTextAnnotation.pages),
        pages: fullTextAnnotation.pages,
        blocks: this.extractBlocks(fullTextAnnotation.pages)
      };
    } catch (error) {
      console.error('Google Vision API Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async detectHandwritingFromBuffer(imageBuffer) {
    try {
      const [result] = await this.client.documentTextDetection(imageBuffer);
      const fullTextAnnotation = result.fullTextAnnotation;

      if (!fullTextAnnotation) {
        return {
          success: false,
          error: 'No text detected in the image'
        };
      }

      return {
        success: true,
        text: fullTextAnnotation.text,
        confidence: this.calculateAverageConfidence(fullTextAnnotation.pages),
        pages: fullTextAnnotation.pages,
        blocks: this.extractBlocks(fullTextAnnotation.pages)
      };
    } catch (error) {
      console.error('Google Vision API Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  calculateAverageConfidence(pages) {
    if (!pages || pages.length === 0) return 0;

    let totalConfidence = 0;
    let wordCount = 0;

    pages.forEach(page => {
      page.blocks?.forEach(block => {
        block.paragraphs?.forEach(paragraph => {
          paragraph.words?.forEach(word => {
            if (word.confidence) {
              totalConfidence += word.confidence;
              wordCount++;
            }
          });
        });
      });
    });

    return wordCount > 0 ? (totalConfidence / wordCount) * 100 : 0;
  }

  extractBlocks(pages) {
    const blocks = [];

    pages?.forEach(page => {
      page.blocks?.forEach(block => {
        const blockText = block.paragraphs?.map(para =>
          para.words?.map(word =>
            word.symbols?.map(symbol => symbol.text).join('')
          ).join(' ')
        ).join('\n');

        blocks.push({
          text: blockText,
          confidence: block.confidence
        });
      });
    });

    return blocks;
  }

  async detectLabels(imagePath) {
    try {
      const [result] = await this.client.labelDetection(imagePath);
      const labels = result.labelAnnotations;

      return {
        success: true,
        labels: labels.map(label => ({
          description: label.description,
          score: label.score,
          confidence: label.score * 100
        }))
      };
    } catch (error) {
      console.error('Google Vision Label Detection Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new GoogleVisionService();
