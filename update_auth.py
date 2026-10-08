import codecs
import re

filepath = 'C:/Renas/Antigravity/Website-builder/src/contexts/AuthContext.jsx'

with codecs.open(filepath, 'r', 'utf-8') as f:
    content = f.read()

target = '''  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch additional user data from Firestore if needed
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          setCurrentUser({ ...user, profile: userDoc.exists() ? userDoc.data() : {} });
        } catch (error) {
          console.error("Erro ao buscar dados do usuário no Firestore:", error);
          setCurrentUser({ ...user, profile: {} }); // Permite o login mesmo se o Firestore falhar
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);'''

# Using regex because of encoding
replacement = '''  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch additional user data from Firestore if needed
        try {
          const userRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            const data = userDoc.data();
            setCurrentUser({ ...user, profile: data });
            
            // Sync emailVerified to Firestore so Admins can see it
            if (data.emailVerified !== user.emailVerified) {
              await setDoc(userRef, { emailVerified: user.emailVerified }, { merge: true });
            }
          } else {
            setCurrentUser({ ...user, profile: {} });
          }
        } catch (error) {
          console.error("Erro ao buscar dados do usuário no Firestore:", error);
          setCurrentUser({ ...user, profile: {} }); // Permite o login mesmo se o Firestore falhar
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);'''

content = re.sub(
    r'  useEffect\(\(\) => \{.*?return unsubscribe;\n  \}, \[\]\);',
    replacement,
    content,
    flags=re.DOTALL
)

with codecs.open(filepath, 'w', 'utf-8') as f:
    f.write(content)
