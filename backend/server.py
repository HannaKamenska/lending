from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field
from typing import List, Optional
import os
from datetime import datetime
import uuid

app = FastAPI(title="Astro Consulting API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017/astro_consulting")
client = AsyncIOMotorClient(MONGO_URL)
db = client.astro_consulting

# Pydantic models
class Service(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    price: str
    duration: str
    features: List[str]

class Testimonial(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    text: str
    rating: int
    date: str
    avatar_url: Optional[str] = None

class ConsultationRequest(BaseModel):
    name: str
    email: str
    phone: str
    service_id: str
    message: Optional[str] = None
    preferred_date: Optional[str] = None

class ContactForm(BaseModel):
    name: str
    email: str
    subject: str
    message: str

# Sample data initialization
@app.on_event("startup")
async def initialize_data():
    # Check if services already exist
    services_count = await db.services.count_documents({})
    if services_count == 0:
        sample_services = [
            {
                "id": str(uuid.uuid4()),
                "title": "Психоастрологическая консультация",
                "description": "Глубокий анализ личности через призму астрологии и психологии. Поможет понять ваши сильные стороны, скрытые таланты и жизненные задачи.",
                "price": "5 000 ₽",
                "duration": "90 минут",
                "features": ["Анализ натальной карты", "Психологический портрет", "Рекомендации по развитию", "Запись сессии"]
            },
            {
                "id": str(uuid.uuid4()),
                "title": "Анализ натальной карты",
                "description": "Детальный разбор вашей натальной карты с акцентом на ключевые аспекты личности, кармические задачи и потенциал развития.",
                "price": "3 500 ₽",
                "duration": "60 минут",
                "features": ["Полный анализ планет", "Аспекты и конфигурации", "Письменный отчет", "Рекомендации"]
            },
            {
                "id": str(uuid.uuid4()),
                "title": "Консультация по отношениям",
                "description": "Астропсихологический анализ совместимости и динамики отношений. Поможет понять партнера и гармонизировать отношения.",
                "price": "4 500 ₽",
                "duration": "75 минут",
                "features": ["Синастрический анализ", "Композитная карта", "Советы по взаимодействию", "Прогноз развития"]
            },
            {
                "id": str(uuid.uuid4()),
                "title": "Трансформационная сессия",
                "description": "Глубокая работа с текущими жизненными вызовами через интеграцию астрологических инсайтов и психологических практик.",
                "price": "6 000 ₽",
                "duration": "120 минут",
                "features": ["Диагностика блоков", "Трансформационные техники", "Персональные практики", "План развития"]
            },
            {
                "id": str(uuid.uuid4()),
                "title": "Карьерное ориентирование",
                "description": "Определение профессионального призвания и карьерного пути через астрологический анализ талантов и предрасположенностей.",
                "price": "4 000 ₽",
                "duration": "60 минут",
                "features": ["Анализ призвания", "Профессиональные рекомендации", "Благоприятные периоды", "Стратегия развития"]
            }
        ]
        await db.services.insert_many(sample_services)

    # Check if testimonials already exist
    testimonials_count = await db.testimonials.count_documents({})
    if testimonials_count == 0:
        sample_testimonials = [
            {
                "id": str(uuid.uuid4()),
                "name": "Анна М.",
                "text": "Консультация помогла мне понять глубинные причины моих реакций и найти внутренние ресурсы для изменений. Очень благодарна за такой деликатный и профессиональный подход!",
                "rating": 5,
                "date": "15 февраля 2024"
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Дмитрий К.",
                "text": "Никогда не верил в астрологию, но решил попробовать в сложный период. Был поражен точностью анализа и практичностью рекомендаций. Многое стало на свои места.",
                "rating": 5,
                "date": "28 января 2024"
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Елена С.",
                "text": "Консультация по отношениям буквально спасла мой брак. Поняла, как лучше взаимодействовать с мужем, учитывая наши астрологические особенности. Рекомендую всем!",
                "rating": 5,
                "date": "10 марта 2024"
            }
        ]
        await db.testimonials.insert_many(sample_testimonials)

# API Routes
@app.get("/api/services", response_model=List[Service])
async def get_services():
    services = await db.services.find({}).to_list(None)
    return services

@app.get("/api/testimonials", response_model=List[Testimonial])
async def get_testimonials():
    testimonials = await db.testimonials.find({}).to_list(None)
    return testimonials

@app.post("/api/consultation-request")
async def create_consultation_request(request: ConsultationRequest):
    request_data = request.dict()
    request_data["id"] = str(uuid.uuid4())
    request_data["created_at"] = datetime.now().isoformat()
    request_data["status"] = "pending"
    
    result = await db.consultation_requests.insert_one(request_data)
    return {"success": True, "id": request_data["id"], "message": "Заявка успешно отправлена! Я свяжусь с вами в ближайшее время."}

@app.post("/api/contact")
async def create_contact_message(contact: ContactForm):
    contact_data = contact.dict()
    contact_data["id"] = str(uuid.uuid4())
    contact_data["created_at"] = datetime.now().isoformat()
    contact_data["status"] = "new"
    
    result = await db.contact_messages.insert_one(contact_data)
    return {"success": True, "id": contact_data["id"], "message": "Сообщение отправлено! Отвечу вам в течение 24 часов."}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "message": "Astro Consulting API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)