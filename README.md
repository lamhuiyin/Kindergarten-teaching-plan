<img width="741" height="524" alt="image" src="https://github.com/user-attachments/assets/03c02c34-d967-4f11-8971-0a67068064cd" /># Kindergarten Lesson Planner

### User Inputs: 
Theme, Age Group (K1/K2/K3), Activity Duration, Key Learning Area, Additional Notes.

### System Prompt Outline: 
"You are an expert kindergarten curriculum designer... Create a detailed teaching plan STRICTLY based on the provided curriculum guide content. The plan must include: 1. Learning Objectives, 2. Key Vocabulary, 3. Activity Description, 4. Assessment for Learning. Adhere to the principles of Child-centredness and Learning through Play."

### Chosen LLM & Embedding Model:

LLM: deepseek/deepseek-chat-v3.1:free on OpenRouter. 
Why: It is powerful, offers a free tier, is reliable for educational content generation, and can be prompted to follow strict guidelines.

Embedding: text-embedding-3-small (OpenAI). 
Why: The industry standard, highly effective for semantic search,is  readily available in n8n.

### n8n Workflow Design:

1. Manual click to execute load PDF into database -> HTTP Request node fetches the EDB PDF from the public URL -> The PDF is loaded and split into chunks. -> Chunks are converted into embeddings using OpenAI's model. -> Embeddings are stored in Pinecone Vector Store.
<img width="741" height="524" alt="image" src="https://github.com/user-attachments/assets/f2ce7d23-9815-429c-aa2c-7affedffa686" />


2. Frontend receives the user's input to query the vector store -> fetches the most relevant chunks from Pinecone Vector Store, and injects them into the prompt for the Deepseek LLM -> The generated lesson plan is sent back to the frontend via the Respond to Webhook node.
<img width="871" height="655" alt="image" src="https://github.com/user-attachments/assets/0200a581-6ee7-4d59-84a7-e64b2ac06500" />


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
