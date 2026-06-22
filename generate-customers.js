const fs = require('fs');
const path = require('path');

const firstNamesMale = ['Arjun','Rohan','Amit','Karan','Vikram','Siddharth','Raviraj','Aakash','Dev','Rahul','Aniket','Nikhil','Kunal','Vivek','Manish','Aditya','Arnav','Sameer','Anand','Rajat'];
const firstNamesFemale = ['Aisha','Priya','Anjali','Neha','Ishita','Nandini','Sanya','Tara','Riya','Kavya','Pooja','Meera','Sakshi','Shruti','Nisha','Varsha','Aditi','Rhea','Sonal','Ritika'];
const lastNames = ['Sharma','Verma','Patel','Kapoor','Mehta','Nair','Joshi','Reddy','Banerjee','Singh','Khan','Gupta','Trivedi','Chopra','Mukherjee','Rao','Shah','Iyer','Bose','Desai'];
const cities = ['Mumbai','Delhi','Bengaluru','Chennai','Hyderabad','Pune','Ahmedabad','Kolkata','Jaipur','Lucknow','Chandigarh','Gurgaon','Noida','Surat','Nagpur'];
const colleges = ['IIT Delhi','IIT Bombay','IIT Madras','IIM Ahmedabad','IIM Bangalore','Delhi University','St. Xavier\'s College','Christ University','NIT Trichy','BITS Pilani','XLRI Jamshedpur','Lady Shri Ram College','Symbiosis','Amity University','Manipal University'];
const degrees = ['B.Tech','BE','MBA','BBA','BCA','MCA','BA','MA','MS','B.Com','M.Com'];
const companies = ['Tata Consultancy Services','Infosys','Wipro','Accenture','Reliance','HDFC Bank','Amazon','Google','Microsoft','Zoho','Flipkart','ITC','Mahindra','Godrej','Ola'];
const designations = ['Software Engineer','Product Manager','Business Analyst','Consultant','Data Scientist','Marketing Manager','Sales Lead','Finance Manager','HR Executive','Operations Head'];
const languages = ['Hindi','English','Marathi','Tamil','Telugu','Gujarati','Kannada','Malayalam','Punjabi','Bengali'];
const familyTypes = ['Nuclear','Joint','Extended'];
const diets = ['Vegetarian','Non-Vegetarian','Eggetarian','Vegan'];
const habits = ['Non-smoker','Smoker','Occasional smoker','Non-drinker','Drink socially'];
const religions = ['Hindu','Muslim','Christian','Sikh','Jain','Buddhist','Other'];
const castes = ['Brahmin','Kshatriya','Vaishya','Shudra','OBC','General','Other'];
const statuses = ['New','In Progress','Matched'];
const horoscopes = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const genders = ['Male','Female'];
const siblingOptions = ['No siblings','One sibling','Two siblings','Three or more siblings'];

function randomItem(list) {
  return list[Math.floor(Math.random() * list.length)];
}
function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randomBoolean(chance = 0.5) {
  return Math.random() < chance;
}

function randomDateFromAge(minAge, maxAge) {
  const current = new Date();
  const year = current.getFullYear() - randomNumber(minAge, maxAge);
  const month = randomNumber(0, 11);
  const day = randomNumber(1, 28);
  const date = new Date(year, month, day);
  return date.toISOString().slice(0, 10);
}

function generateCustomer(id) {
  const gender = randomItem(genders);
  const firstName = gender === 'Male' ? randomItem(firstNamesMale) : randomItem(firstNamesFemale);
  const lastName = randomItem(lastNames);
  const city = randomItem(cities);
  const religion = randomItem(religions);
  const caste = religion === 'Hindu' ? randomItem(castes.slice(0, 6)) : religion === 'Muslim' ? 'Other' : 'Other';
  const college = randomItem(colleges);
  const degree = randomItem(degrees);
  const company = randomItem(companies);
  const designation = randomItem(designations);
  const income = randomNumber(450000, 2200000);
  const wantKids = randomBoolean(0.8);
  const openToRelocate = randomBoolean(0.6);
  const openToPets = randomBoolean(0.5);
  const status = randomItem(statuses);
  const dob = randomDateFromAge(24, 34);
  const phone = `+91 9${randomNumber(100000000, 999999999)}`;
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randomNumber(1, 99)}@example.com`;
  const horo = randomItem(horoscopes);
  const manglik = randomItem(['Yes','No','Partial']);
  const familyType = randomItem(familyTypes);
  const dietPreference = randomItem(diets);
  const habitSet = [];
  while (habitSet.length < 2) {
    const hab = randomItem(habits);
    if (!habitSet.includes(hab)) habitSet.push(hab);
  }
  const languagesSpoken = [];
  while (languagesSpoken.length < 2) {
    const lang = randomItem(languages);
    if (!languagesSpoken.includes(lang)) languagesSpoken.push(lang);
  }

  return {
    id: String(id),
    firstName,
    lastName,
    gender,
    dob,
    country: 'India',
    city,
    height: randomNumber(155, 190),
    email,
    phone,
    undergradCollege: college,
    degree,
    income,
    company,
    designation,
    maritalStatus: 'Single',
    languages: languagesSpoken,
    siblings: randomItem(siblingOptions),
    caste,
    religion,
    wantKids,
    openToRelocate,
    openToPets,
    horoscopeSign: horo,
    manglikStatus: manglik,
    familyType,
    dietPreference,
    habits: habitSet,
    status,
    notes: [],
  };
}

const customers = [];
for (let i = 1; i <= 100; i += 1) {
  customers.push(generateCustomer(i));
}

const dataDir = path.join(__dirname, 'src', 'data');
fs.mkdirSync(dataDir, { recursive: true });
fs.writeFileSync(path.join(dataDir, 'customers.json'), JSON.stringify(customers, null, 2));
console.log('Generated', customers.length, 'customers to src/data/customers.json');
