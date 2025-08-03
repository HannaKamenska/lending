import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  StarIcon, 
  HeartIcon, 
  CheckCircleIcon,
  ClockIcon,
  PhoneIcon,
  EnvelopeIcon,
  ChatBubbleBottomCenterTextIcon,
  UserCircleIcon
} from '@heroicons/react/24/solid';
import './App.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
const TELEGRAM_BOT_USERNAME = process.env.REACT_APP_TELEGRAM_BOT_USERNAME || 'your_bot_username';

function App() {
  const [services, setServices] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [consultationForm, setConsultationForm] = useState({
    name: '',
    email: '',
    phone: '',
    service_id: '',
    message: '',
    preferred_date: ''
  });
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [showConsultationForm, setShowConsultationForm] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [servicesRes, testimonialsRes] = await Promise.all([
        axios.get(`${BACKEND_URL}/api/services`),
        axios.get(`${BACKEND_URL}/api/testimonials`)
      ]);
      setServices(servicesRes.data);
      setTestimonials(testimonialsRes.data);
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConsultationSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const response = await axios.post(`${BACKEND_URL}/api/consultation-request`, consultationForm);
      setSubmitMessage(response.data.message);
      setConsultationForm({
        name: '',
        email: '',
        phone: '',
        service_id: '',
        message: '',
        preferred_date: ''
      });
      setShowConsultationForm(false);
      setSelectedService(null);
    } catch (error) {
      setSubmitMessage('Произошла ошибка при отправке заявки. Попробуйте снова.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const response = await axios.post(`${BACKEND_URL}/api/contact`, contactForm);
      setSubmitMessage(response.data.message);
      setContactForm({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      setSubmitMessage('Произошла ошибка при отправке сообщения. Попробуйте снова.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openConsultationForm = (service) => {
    setSelectedService(service);
    setConsultationForm(prev => ({
      ...prev,
      service_id: service.id
    }));
    setShowConsultationForm(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lavender-600 mx-auto mb-4"></div>
          <p className="text-lavender-700">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      {/* Skip Link для доступности */}
      <a href="#main-content" className="skip-link">
        Перейти к основному содержимому
      </a>

      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm shadow-sm sticky top-0 z-40">
        <nav className="container mx-auto px-4 py-4" role="navigation" aria-label="Главная навигация">
          <div className="flex justify-between items-center">
            <div className="text-xl font-serif font-bold text-gradient">
              Астролог-психолог
            </div>
            <div className="hidden md:flex space-x-6">
              <a href="#services" className="text-gray-700 hover:text-lavender-600 transition-colors font-medium">
                Услуги
              </a>
              <a href="#about" className="text-gray-700 hover:text-lavender-600 transition-colors font-medium">
                Обо мне
              </a>
              <a href="#testimonials" className="text-gray-700 hover:text-lavender-600 transition-colors font-medium">
                Отзывы
              </a>
              <a href="#contact" className="text-gray-700 hover:text-lavender-600 transition-colors font-medium">
                Контакты
              </a>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main id="main-content">
        {/* Hero Section */}
        <section className="relative min-h-screen gradient-bg flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHwzfHxhc3Ryb2xvZ3l8ZW58MHx8fHwxNzU0MjUzMDQxfDA&ixlib=rb-4.1.0&q=85"
              alt="Силуэт человека под звездным небом, символизирующий связь с космосом и духовное руководство"
              className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-lavender-900/20 to-gold-900/20"></div>
          </div>
          
          <div className="relative container mx-auto px-4 text-center animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-gray-800 mb-6">
              Елена Звездная
              <span className="block text-2xl md:text-3xl text-lavender-700 font-medium mt-2">
                Астролог-психолог трансформаций
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed">
              Глубокие консультации, которые помогают понять себя, тело и чувства — и изменить жизнь к лучшему
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a 
                href="#services" 
                className="btn-primary text-lg px-8 py-4 no-print"
                aria-label="Перейти к услугам и записаться на консультацию"
              >
                Начать путь трансформации
              </a>
              <a 
                href={`https://t.me/${TELEGRAM_BOT_USERNAME}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-lg px-8 py-4 no-print"
                aria-label="Написать в Telegram для быстрой связи"
              >
                <ChatBubbleBottomCenterTextIcon className="w-5 h-5 inline mr-2" />
                Написать в Telegram
              </a>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-center text-gray-800 mb-4">
              Мои услуги
            </h2>
            <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
              Персональные консультации, которые помогают найти ответы на важные вопросы и направить жизнь в желаемое русло
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <div 
                  key={service.id} 
                  className={`card p-6 animate-slide-up`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <h3 className="text-xl font-serif font-semibold text-gray-800 mb-3">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {service.description}
                  </p>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-sm text-gray-500">
                      <ClockIcon className="w-4 h-4 mr-2 text-lavender-600" />
                      <span>{service.duration}</span>
                    </div>
                    <div className="text-2xl font-bold text-lavender-600">
                      {service.price}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-700 mb-2">Что включено:</h4>
                    <ul className="space-y-1">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start text-sm text-gray-600">
                          <CheckCircleIcon className="w-4 h-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => openConsultationForm(service)}
                    className="w-full btn-primary"
                    aria-label={`Записаться на ${service.title}`}
                  >
                    Записаться
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 gradient-bg">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="animate-fade-in">
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-800 mb-6">
                    Обо мне
                  </h2>
                  <div className="space-y-6 text-gray-700 leading-relaxed">
                    <p className="text-lg">
                      Меня зовут Елена, и уже более 8 лет я помогаю людям находить ответы на самые важные вопросы жизни через синтез астрологии и психологии.
                    </p>
                    <p>
                      Мой подход основан на глубоком понимании того, что каждый человек уникален, и его путь трансформации также индивидуален. Я использую натальную карту как карту души, которая показывает ваши сильные стороны, скрытые таланты и жизненные задачи.
                    </p>
                    <p>
                      В работе я сочетаю классическую астрологию с современными психологическими подходами, что позволяет не просто предсказывать события, а давать практические инструменты для личностного роста и гармонизации жизни.
                    </p>
                    <div className="flex flex-wrap gap-4 pt-4">
                      <div className="bg-white/50 rounded-lg px-4 py-2">
                        <span className="text-sm font-semibold text-lavender-700">8+ лет практики</span>
                      </div>
                      <div className="bg-white/50 rounded-lg px-4 py-2">
                        <span className="text-sm font-semibold text-lavender-700">500+ консультаций</span>
                      </div>
                      <div className="bg-white/50 rounded-lg px-4 py-2">
                        <span className="text-sm font-semibold text-lavender-700">Сертифицированный психолог</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="animate-slide-up">
                  <img
                    src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzZ8MHwxfHNlYXJjaHwxfHxtZWRpdGF0aW9ufGVufDB8fHx8MTc1NDI1MzA3Nnww&ixlib=rb-4.1.0&q=85"
                    alt="Женщина в состоянии медитации, символизирующая духовную практику и самопознание"
                    className="w-full rounded-xl shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-center text-gray-800 mb-4">
              Отзывы клиентов
            </h2>
            <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
              Реальные истории трансформации от тех, кто уже прошёл этот путь
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div 
                  key={testimonial.id} 
                  className={`card p-6 animate-slide-up`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center mb-4">
                    <div className="flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <StarIcon key={i} className="w-5 h-5 text-gold-500" />
                      ))}
                    </div>
                  </div>
                  
                  <blockquote className="text-gray-700 mb-4 leading-relaxed italic">
                    "{testimonial.text}"
                  </blockquote>
                  
                  <footer className="flex items-center justify-between">
                    <div className="flex items-center">
                      <UserCircleIcon className="w-10 h-10 text-lavender-400 mr-3" />
                      <div>
                        <div className="font-semibold text-gray-800">{testimonial.name}</div>
                        <div className="text-sm text-gray-500">{testimonial.date}</div>
                      </div>
                    </div>
                    <HeartIcon className="w-6 h-6 text-pink-500" />
                  </footer>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 gradient-bg">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-center text-gray-800 mb-4">
                Связаться со мной
              </h2>
              <p className="text-xl text-center text-gray-600 mb-12">
                Готова ответить на ваши вопросы и помочь найти путь к гармонии
              </p>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Contact Info */}
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-serif font-semibold text-gray-800 mb-6">
                      Способы связи
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <PhoneIcon className="w-6 h-6 text-lavender-600 mr-4" />
                        <span className="text-gray-700">+7 (999) 123-45-67</span>
                      </div>
                      <div className="flex items-center">
                        <EnvelopeIcon className="w-6 h-6 text-lavender-600 mr-4" />
                        <span className="text-gray-700">elena@astro-psychology.ru</span>
                      </div>
                      <div className="flex items-center">
                        <ChatBubbleBottomCenterTextIcon className="w-6 h-6 text-lavender-600 mr-4" />
                        <a 
                          href={`https://t.me/${TELEGRAM_BOT_USERNAME}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-lavender-600 hover:text-lavender-700"
                        >
                          @{TELEGRAM_BOT_USERNAME}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* FAQ */}
                  <div>
                    <h3 className="text-xl font-serif font-semibold text-gray-800 mb-6">
                      Частые вопросы
                    </h3>
                    <div className="space-y-4">
                      <details className="bg-white/50 rounded-lg p-4">
                        <summary className="font-semibold text-gray-700 cursor-pointer">
                          Как проходит консультация?
                        </summary>
                        <p className="mt-3 text-gray-600 leading-relaxed">
                          Консультация проходит онлайн в удобное для вас время. Для астрологического анализа мне потребуются ваши точные данные рождения: дата, время и место.
                        </p>
                      </details>
                      
                      <details className="bg-white/50 rounded-lg p-4">
                        <summary className="font-semibold text-gray-700 cursor-pointer">
                          Что нужно подготовить?
                        </summary>
                        <p className="mt-3 text-gray-600 leading-relaxed">
                          Подготовьте ваши точные данные рождения и список вопросов, которые вас беспокоят. Это поможет максимально эффективно использовать время консультации.
                        </p>
                      </details>
                      
                      <details className="bg-white/50 rounded-lg p-4">
                        <summary className="font-semibold text-gray-700 cursor-pointer">
                          Можно ли записаться на повторную консультацию?
                        </summary>
                        <p className="mt-3 text-gray-600 leading-relaxed">
                          Конечно! Многие клиенты приходят на повторные сессии для углубления работы или при изменении жизненных обстоятельств.
                        </p>
                      </details>
                    </div>
                  </div>
                </div>

                {/* Contact Form */}
                <div>
                  <form onSubmit={handleContactSubmit} className="card p-6">
                    <h3 className="text-xl font-serif font-semibold text-gray-800 mb-6">
                      Написать мне
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="contact-name" className="block text-sm font-semibold text-gray-700 mb-2">
                          Ваше имя
                        </label>
                        <input
                          type="text"
                          id="contact-name"
                          value={contactForm.name}
                          onChange={(e) => setContactForm(prev => ({...prev, name: e.target.value}))}
                          className="w-full px-4 py-3 border border-beige-300 rounded-lg focus:ring-2 focus:ring-lavender-500 focus:border-transparent"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="contact-email" className="block text-sm font-semibold text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          id="contact-email"
                          value={contactForm.email}
                          onChange={(e) => setContactForm(prev => ({...prev, email: e.target.value}))}
                          className="w-full px-4 py-3 border border-beige-300 rounded-lg focus:ring-2 focus:ring-lavender-500 focus:border-transparent"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="contact-subject" className="block text-sm font-semibold text-gray-700 mb-2">
                          Тема
                        </label>
                        <input
                          type="text"
                          id="contact-subject"
                          value={contactForm.subject}
                          onChange={(e) => setContactForm(prev => ({...prev, subject: e.target.value}))}
                          className="w-full px-4 py-3 border border-beige-300 rounded-lg focus:ring-2 focus:ring-lavender-500 focus:border-transparent"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="contact-message" className="block text-sm font-semibold text-gray-700 mb-2">
                          Сообщение
                        </label>
                        <textarea
                          id="contact-message"
                          rows="4"
                          value={contactForm.message}
                          onChange={(e) => setContactForm(prev => ({...prev, message: e.target.value}))}
                          className="w-full px-4 py-3 border border-beige-300 rounded-lg focus:ring-2 focus:ring-lavender-500 focus:border-transparent resize-vertical"
                          required
                        />
                      </div>
                      
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? 'Отправляю...' : 'Отправить сообщение'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-6">
            <h3 className="text-2xl font-serif font-bold text-gradient mb-2">
              Елена Звездная
            </h3>
            <p className="text-gray-300">
              Астролог-психолог трансформаций
            </p>
          </div>
          
          <div className="flex justify-center space-x-6 mb-6">
            <a href="#services" className="text-gray-300 hover:text-white transition-colors">
              Услуги
            </a>
            <a href="#about" className="text-gray-300 hover:text-white transition-colors">
              Обо мне
            </a>
            <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors">
              Отзывы
            </a>
            <a href="#contact" className="text-gray-300 hover:text-white transition-colors">
              Контакты
            </a>
          </div>
          
          <div className="border-t border-gray-700 pt-6">
            <p className="text-gray-400 text-sm">
              © 2024 Елена Звездная. Все права защищены.
            </p>
          </div>
        </div>
      </footer>

      {/* Consultation Modal */}
      {showConsultationForm && selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-serif font-semibold text-gray-800">
                  Записаться на "{selectedService.title}"
                </h3>
                <button
                  onClick={() => {
                    setShowConsultationForm(false);
                    setSelectedService(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Закрыть форму"
                >
                  ✕
                </button>
              </div>
              
              <form onSubmit={handleConsultationSubmit} className="space-y-4">
                <div>
                  <label htmlFor="cons-name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Ваше имя
                  </label>
                  <input
                    type="text"
                    id="cons-name"
                    value={consultationForm.name}
                    onChange={(e) => setConsultationForm(prev => ({...prev, name: e.target.value}))}
                    className="w-full px-4 py-3 border border-beige-300 rounded-lg focus:ring-2 focus:ring-lavender-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="cons-email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="cons-email"
                    value={consultationForm.email}
                    onChange={(e) => setConsultationForm(prev => ({...prev, email: e.target.value}))}
                    className="w-full px-4 py-3 border border-beige-300 rounded-lg focus:ring-2 focus:ring-lavender-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="cons-phone" className="block text-sm font-semibold text-gray-700 mb-2">
                    Телефон
                  </label>
                  <input
                    type="tel"
                    id="cons-phone"
                    value={consultationForm.phone}
                    onChange={(e) => setConsultationForm(prev => ({...prev, phone: e.target.value}))}
                    className="w-full px-4 py-3 border border-beige-300 rounded-lg focus:ring-2 focus:ring-lavender-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="cons-date" className="block text-sm font-semibold text-gray-700 mb-2">
                    Предпочтительная дата
                  </label>
                  <input
                    type="date"
                    id="cons-date"
                    value={consultationForm.preferred_date}
                    onChange={(e) => setConsultationForm(prev => ({...prev, preferred_date: e.target.value}))}
                    className="w-full px-4 py-3 border border-beige-300 rounded-lg focus:ring-2 focus:ring-lavender-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label htmlFor="cons-message" className="block text-sm font-semibold text-gray-700 mb-2">
                    Дополнительная информация
                  </label>
                  <textarea
                    id="cons-message"
                    rows="3"
                    value={consultationForm.message}
                    onChange={(e) => setConsultationForm(prev => ({...prev, message: e.target.value}))}
                    placeholder="Расскажите о ваших вопросах или пожеланиях..."
                    className="w-full px-4 py-3 border border-beige-300 rounded-lg focus:ring-2 focus:ring-lavender-500 focus:border-transparent resize-vertical"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Отправляю...' : 'Отправить заявку'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Success/Error Message */}
      {submitMessage && (
        <div className="fixed bottom-4 right-4 bg-white border-l-4 border-green-500 rounded-lg shadow-lg p-4 max-w-md z-50">
          <div className="flex items-center">
            <CheckCircleIcon className="w-6 h-6 text-green-500 mr-3" />
            <p className="text-gray-800">{submitMessage}</p>
            <button
              onClick={() => setSubmitMessage('')}
              className="ml-auto text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;