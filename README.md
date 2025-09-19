# Kindergarten Lesson Planner

### User Inputs: 
Theme, Age Group (K1/K2/K3), Activity Duration, Key Learning Area, Additional Notes.

### System Prompt Outline: 
"You are an expert kindergarten curriculum designer... Create a detailed teaching plan STRICTLY based on the provided curriculum guide content. The plan must include: 1. Learning Objectives, 2. Key Vocabulary, 3. Activity Description, 4. Assessment for Learning. Adhere to the principles of Child-centredness and Learning through Play."

### Chosen LLM & Embedding Model:

LLM: deepseek/deepseek-chat-v3.1:free on OpenRouter. 
Why: It is powerful, offers a free tier, is reliable for educational content generation, and can be prompted to follow strict guidelines.

Embedding: text-embedding-3-small (OpenAI). 
Why: The industry standard, highly effective for semantic search,is  readily available in n8n.

### n8n Workflow Design (High Level):

1. Webhook receives user input from the frontend. -> HTTP Request node fetches the EDB PDF from the public URL. -> The PDF is loaded and split into chunks. -> Chunks are converted into embeddings using OpenAI's model. -> Embeddings are stored in Pinecone Vector Store.

<img width="794" height="539" alt="image" src="https://github.com/user-attachments/assets/ce2cd1d3-9f65-478b-ad76-b1cb11562ca5" />



2. Frontend receives the user's input to query the vector store -> fetches the most relevant chunks, and injects them into the prompt for the Deepseek LLM -> The generated lesson plan is sent back to the user via the Respond to Webhook node.

<img width="884" height="657" alt="image" src="https://github.com/user-attachments/assets/da10b94f-9a67-4ead-9323-b16e4782ca2e" />



## Architecture

### Frontend
- Pure HTML/CSS/JavaScript implementation
- Responsive design with mobile support
- Features:
  - Interactive form for plan specifications
  - Real-time plan generation
  - PDF export functionality
  - Copy to clipboard with formatting
  - Debug mode for troubleshooting

### Backend (n8n Workflow)
- Document Processing:
  - PDF extraction of EDB curriculum guide
  - Text chunking with recursive character splitting
  - Vector embeddings storage in Pinecone

- LLM Integration:
  - Model: DeepSeek Chat v3.1
  - Provider: OpenRouter
  - Chosen for:
    - Strong performance on structured outputs
    - Cost-effective API usage
    - Good context window size
    - Native Chinese language + English support

- Vector Store:
  - Platform: Pinecone
  - Embedding Model: OpenAI text-embedding-3-small
  - Advantages:
    - Fast similarity search
    - Efficient vector storage
    - Easy integration with n8n

## Usage

1. Access the web interface at https://lamhuiyin.github.io/Kindergarten-teaching-plan/
2. Fill in the plan requirements:
   - Theme/Topic (e.g., "Seasons", "Animals")
   - Age Group (K1-K3)
   - Duration (30-90 minutes)
   - Learning Area (6 key areas from EDB guide)
   - Optional additional notes

3. Click "Generate Lesson Plan"
4. View, download, or copy the generated plan

## Sample Output

### Input
- Theme: Seasons
- Age Group: K2 (3-4 years)
- Duration: 45 minutes
- Learning Area: Nature and Living

### Output
```markdown
### Learning Objectives:
1. To develop sensory abilities through exploring seasonal changes
2. To encourage observation of natural elements
3. To build vocabulary related to weather and seasons

### Key Vocabulary:
- Seasons
- Weather
- Changes
- Temperature
- Nature

[... full plan in project samples folder ...]
```
