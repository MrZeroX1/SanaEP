from flask import Blueprint, request, jsonify
import os
import logging
import openai
from flask_cors import CORS

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Get API key from environment variables
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "")
if not OPENAI_API_KEY:
    logger.warning("OpenAI API key not set! Chatbot functionality will be limited.")

# Set the OpenAI API key
openai.api_key = OPENAI_API_KEY

# Create blueprint
router = Blueprint('chatbot', __name__, url_prefix='/api/chatbot')
CORS(router, supports_credentials=True)

@router.route('/chat', methods=['POST'])
def chat_with_bot():
    """
    Chat with the medical assistant bot about epilepsy and seizures
    """
    try:
        logger.info(f"Received chat request: {request.get_json()}")

        if not OPENAI_API_KEY:
            logger.error("OpenAI API key not configured")
            return jsonify({"error": "OpenAI API key not configured"}), 500

        # For now, use a mock user (replace with real auth as needed)
        current_user = {"username": "test_user", "is_doctor": False}
        logger.info(f"Current user: {current_user}")

        data = request.get_json()
        message = data.get("message")
        if not message:
            logger.warning("No message provided in request")
            return jsonify({"error": "Message is required"}), 400

        logger.info(f"Processing message: {message}")

        # Personalize system message
        is_doctor = current_user.get("is_doctor", False)
        if is_doctor:
            system_message = (
                "You are a medical assistant specialized in epilepsy and seizure disorders. "
                "Provide professional, evidence-based information suitable for medical professionals."
            )
        else:
            system_message = (
                "You are a friendly medical assistant who helps patients understand epilepsy, PNES, and seizures. "
                "Explain medical concepts in simple terms. Remember, you are not a doctor, and all advice should encourage consulting with healthcare providers."
            )

        logger.info(f"Using system message: {system_message}")

        # Call OpenAI API
        logger.info("Calling OpenAI API...")
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": message}
            ],
            max_tokens=500,
            temperature=0.7,
        )

        reply = response.choices[0].message.content.strip() if response.choices[0].message.content else "I'm sorry, I couldn't generate a response."
        logger.info(f"OpenAI response: {reply[:100]}...")

        return jsonify({"reply": reply})

    except Exception as e:
        logger.error(f"Error in chatbot: {str(e)}", exc_info=True)
        return jsonify({"error": f"Chatbot error: {str(e)}"}), 500