import os
from flask import Flask, jsonify, request, send_from_directory, abort
from flask_cors import CORS
from werkzeug.utils import secure_filename
import google.generativeai as genai
from dotenv import load_dotenv
import docx2txt
from PIL import Image
import pytesseract
from io import BytesIO

genai.configure(api_key=os.environ['API_KEY'])

app = Flask(__name__)
CORS(app)
UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')


@app.route('/analyze', methods=["GET", "POST"])
def analyze():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    job_title = request.form.get('jobTitle') 
    experience_level = request.form.get('experienceLevel')
    if file:
        filename = file.filename
        file_extension = os.path.splitext(filename)[1].lower()

        def extract_text_from_file(file):
            if file_extension == '.pdf':
                temp_path = os.path.join('uploads', filename)
                file.save(temp_path)
                sample_file = genai.upload_file(path=temp_path)
                os.remove(temp_path)
                return sample_file
            elif file_extension == '.docx':
                return docx2txt.process(file)
            elif file_extension == '.txt':
                return file.read().decode('utf-8')
            elif file_extension in ['.png', '.jpg', '.jpeg']:
                image = Image.open(BytesIO(file.read()))
                return pytesseract.image_to_string(image)
            else:
                raise ValueError(f"Unsupported file type: {file_extension}")

        def analysis(file):
            load_dotenv()
            genai.configure(api_key=os.getenv("API_KEY"))
            model = genai.GenerativeModel(
                model_name="gemini-1.5-flash",
                system_instruction=f"""
                First of all, the response should not have any other information, not even ```json ``` , or anything else.
                You are an ATS (Applicant Tracking System) evaluation assistant. I have a resume content. Please analyze the resume based on the following criteria and provide clear, concise feedback:

                Keyword Matching,
                Evaluate how well the resume aligns with the job title.
                
                Format Analysis:
                Expected sections are: Contact Information, Summary, Experience, Education, Skills.;
                Identify any missing sections or formatting issues, and suggest improvements to ensure the resume adheres to ATS-friendly formatting.
                
                Content Evaluation:
                The resume includes the relevant experiences and skills,
                Assess the clarity and relevance of these experiences and how well they align with the job description. Suggest areas for improvement.
                
                Length Check:
                Is the resume within the ideal length range of 300-600 words? If not, provide suggestions for condensing or elaborating on content as needed.
                
                Score:
                Provide a score from 0 to 100, with 100 being the best score.And the result should be an number nit string

                Overall Analysis:
                Based on the evaluations above, provide a summary score or assessment of the resume's ATS compatibility. Include actionable recommendations for improvement.
                The format of the response should be as follows:
                {{
                    "keyword_matching": {{
                        "feedback": ""
                    }},
                    "format_analysis": {{
                        "feedback": ""
                    }},
                    "content_evaluation": {{
                        "feedback": ""
                    }},
                    "length_check": {{
                        "feedback": "
                    }},
                    "score": {{
			            "feedback":number
                    }}
                    "overall_analysis": {{
			            "feedback"
                    }}
                }}
                And don't add any other information, not even ```json ``` , or anything else.
                """
            )
            extracted_text = extract_text_from_file(file)
            response = model.generate_content(extracted_text)
            
            # Remove ```json and ``` from the response text
            cleaned_response = response.text.strip().lstrip('```json').rstrip('```').strip()
            return cleaned_response
        
        analyzed_data = analysis(file)
        # Save the parsed data as JSON
        json_filename = os.path.splitext(filename)[0] + '.json'
        json_path = os.path.join('uploads', json_filename)
        with open(json_path, 'w', encoding='utf-8') as json_file:
            json_file.write(analyzed_data)
        # Return the analyzed data immediately
        return jsonify({'success': True, 'data': analyzed_data})
    else:
        return jsonify({'error': 'No file selected'}), 400
    

@app.route('/uploads/<filename>', methods=['GET'])
def get_file(filename):
    try:
        return send_from_directory(UPLOAD_FOLDER, filename)
    except FileNotFoundError:
        abort(404, description="File not found")


if __name__ == '__main__':
    app.run(debug=True, port=8080)