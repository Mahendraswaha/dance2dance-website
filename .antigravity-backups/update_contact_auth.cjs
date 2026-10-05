const fs = require('fs');

let content = fs.readFileSync('src/pages/ContactPage.jsx', 'utf8');

// Add import if not exists
if (!content.includes("import { useAuth }")) {
  content = content.replace(
    /import \{ useSearchParams, Link \} from 'react-router-dom';/,
    `import { useSearchParams, Link } from 'react-router-dom';\nimport { useAuth } from '../contexts/AuthContext';`
  );
}

// Update component
content = content.replace(
  /export default function ContactPage\(\) \{\s+const \{ t, i18n \} = useTranslation\(\);\s+const \[searchParams\] = useSearchParams\(\);\s+const isExecutiveMeeting = searchParams\.get\('subject'\) === 'reuniao-executiva';\s+const \[formData, setFormData\] = useState\(\{[\s\S]*?message: ''\s+\}\);/,
  `export default function ContactPage() {
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const { currentUser } = useAuth();

  const isExecutiveMeeting = searchParams.get('subject') === 'reuniao-executiva';

  const [formData, setFormData] = useState({
    name: currentUser?.profile?.fullName || currentUser?.profile?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.profile?.phone || '',
    address: currentUser?.profile?.address || '',
    city: currentUser?.profile?.city || '',
    zip: currentUser?.profile?.zip || '',
    country: currentUser?.profile?.country || '',
    subject: isExecutiveMeeting ? 'reuniao-executiva' : 'geral',
    message: ''
  });

  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        name: prev.name || currentUser.profile?.fullName || currentUser.profile?.name || '',
        email: prev.email || currentUser.email || '',
        phone: prev.phone || currentUser.profile?.phone || '',
        address: prev.address || currentUser.profile?.address || '',
        city: prev.city || currentUser.profile?.city || '',
        zip: prev.zip || currentUser.profile?.zip || '',
        country: prev.country || currentUser.profile?.country || ''
      }));
    }
  }, [currentUser]);`
);

fs.writeFileSync('src/pages/ContactPage.jsx', content, 'utf8');
console.log('ContactPage updated for prefilling user data');
