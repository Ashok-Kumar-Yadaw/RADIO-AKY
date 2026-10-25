ASHOK KUMAR YADAW Radio — GitHub setup

1. Cloudflare account में नया Worker बनाएँ।
2. worker.js का पूरा कोड Worker editor में डालकर Deploy करें।
3. Worker का HTTPS URL कॉपी करें।
4. index.html को RADIO-AKY repository की index.html से बदलें।
5. GitHub Pages खोलकर Ctrl+Shift+R दबाएँ।
6. प्लेयर में Worker URL डालकर Save Worker URL दबाएँ।
7. Live News 24x7, FM Gold Delhi या Raagam चुनें।

277 स्टेशन लिंक आधिकारिक आकाशवाणी पेज से लिए गए हैं। Worker केवल सूची के CloudFront स्टेशनों और उनके उसी directory के HLS resources को relay करता है। बाकी स्टेशन सीधे चलते हैं। बंद upstream links Worker से भी चालू नहीं होते। Worker usage Cloudflare के आपके plan की limits में रहेगा।

यह package तैयार और syntax-checked है। Worker अभी आपके खाते में deploy नहीं हुआ है; end-to-end audio verification बाकी है।
