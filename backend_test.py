import requests
import sys
import json
from datetime import datetime

class AstroConsultingAPITester:
    def __init__(self, base_url="http://localhost:8001"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name} - PASSED")
        else:
            print(f"❌ {name} - FAILED: {details}")
        
        self.test_results.append({
            "name": name,
            "success": success,
            "details": details
        })

    def test_health_endpoint(self):
        """Test /api/health endpoint"""
        try:
            response = requests.get(f"{self.base_url}/api/health", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get("status") == "healthy":
                    self.log_test("Health Check", True)
                    return True
                else:
                    self.log_test("Health Check", False, f"Unexpected response: {data}")
                    return False
            else:
                self.log_test("Health Check", False, f"Status code: {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Health Check", False, f"Exception: {str(e)}")
            return False

    def test_services_endpoint(self):
        """Test /api/services endpoint"""
        try:
            response = requests.get(f"{self.base_url}/api/services", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list) and len(data) == 5:
                    # Check if each service has required fields
                    required_fields = ['id', 'title', 'description', 'price', 'duration', 'features']
                    all_valid = True
                    
                    for service in data:
                        for field in required_fields:
                            if field not in service:
                                all_valid = False
                                break
                        if not all_valid:
                            break
                    
                    if all_valid:
                        self.log_test("Services Endpoint", True, f"Found {len(data)} services with all required fields")
                        return True, data
                    else:
                        self.log_test("Services Endpoint", False, "Missing required fields in services")
                        return False, []
                else:
                    self.log_test("Services Endpoint", False, f"Expected 5 services, got {len(data) if isinstance(data, list) else 'non-list'}")
                    return False, []
            else:
                self.log_test("Services Endpoint", False, f"Status code: {response.status_code}")
                return False, []
                
        except Exception as e:
            self.log_test("Services Endpoint", False, f"Exception: {str(e)}")
            return False, []

    def test_testimonials_endpoint(self):
        """Test /api/testimonials endpoint"""
        try:
            response = requests.get(f"{self.base_url}/api/testimonials", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list) and len(data) == 3:
                    # Check if each testimonial has required fields
                    required_fields = ['id', 'name', 'text', 'rating', 'date']
                    all_valid = True
                    
                    for testimonial in data:
                        for field in required_fields:
                            if field not in testimonial:
                                all_valid = False
                                break
                        if not all_valid:
                            break
                    
                    if all_valid:
                        self.log_test("Testimonials Endpoint", True, f"Found {len(data)} testimonials with all required fields")
                        return True, data
                    else:
                        self.log_test("Testimonials Endpoint", False, "Missing required fields in testimonials")
                        return False, []
                else:
                    self.log_test("Testimonials Endpoint", False, f"Expected 3 testimonials, got {len(data) if isinstance(data, list) else 'non-list'}")
                    return False, []
            else:
                self.log_test("Testimonials Endpoint", False, f"Status code: {response.status_code}")
                return False, []
                
        except Exception as e:
            self.log_test("Testimonials Endpoint", False, f"Exception: {str(e)}")
            return False, []

    def test_consultation_request_endpoint(self, service_id):
        """Test /api/consultation-request POST endpoint"""
        test_data = {
            "name": "Тест Пользователь",
            "email": "test@example.com",
            "phone": "+7 999 123 45 67",
            "service_id": service_id,
            "message": "Тестовое сообщение для консультации",
            "preferred_date": "2024-12-25"
        }
        
        try:
            response = requests.post(
                f"{self.base_url}/api/consultation-request", 
                json=test_data,
                headers={'Content-Type': 'application/json'},
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and "id" in data and "message" in data:
                    self.log_test("Consultation Request POST", True, f"Created request with ID: {data['id']}")
                    return True
                else:
                    self.log_test("Consultation Request POST", False, f"Unexpected response format: {data}")
                    return False
            else:
                self.log_test("Consultation Request POST", False, f"Status code: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Consultation Request POST", False, f"Exception: {str(e)}")
            return False

    def test_contact_endpoint(self):
        """Test /api/contact POST endpoint"""
        test_data = {
            "name": "Тест Контакт",
            "email": "contact@example.com",
            "subject": "Тестовая тема",
            "message": "Тестовое сообщение для контактной формы"
        }
        
        try:
            response = requests.post(
                f"{self.base_url}/api/contact", 
                json=test_data,
                headers={'Content-Type': 'application/json'},
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and "id" in data and "message" in data:
                    self.log_test("Contact Form POST", True, f"Created contact with ID: {data['id']}")
                    return True
                else:
                    self.log_test("Contact Form POST", False, f"Unexpected response format: {data}")
                    return False
            else:
                self.log_test("Contact Form POST", False, f"Status code: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Contact Form POST", False, f"Exception: {str(e)}")
            return False

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting Astro Consulting API Tests...")
        print(f"Testing against: {self.base_url}")
        print("=" * 50)
        
        # Test health endpoint first
        if not self.test_health_endpoint():
            print("❌ Health check failed - API may not be running")
            return False
        
        # Test services endpoint
        services_success, services_data = self.test_services_endpoint()
        
        # Test testimonials endpoint
        testimonials_success, testimonials_data = self.test_testimonials_endpoint()
        
        # Test consultation request endpoint (use first service ID if available)
        if services_success and services_data:
            service_id = services_data[0]['id']
            self.test_consultation_request_endpoint(service_id)
        else:
            self.log_test("Consultation Request POST", False, "No service ID available for testing")
        
        # Test contact endpoint
        self.test_contact_endpoint()
        
        # Print summary
        print("\n" + "=" * 50)
        print(f"📊 Test Summary: {self.tests_passed}/{self.tests_run} tests passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return True
        else:
            print("⚠️  Some tests failed. Check the details above.")
            return False

def main():
    # Use the public endpoint from frontend .env
    tester = AstroConsultingAPITester("http://localhost:8001")
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())