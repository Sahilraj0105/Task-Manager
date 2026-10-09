Parsing:-Browser jab HTML ya CSS code padhta hai.
Tokenization:-Code ko chote-chote tukron (tokens) mein todne.
DOM Tree(Document Object Model):-HTML ka ek tree-like structure jisme saare elements parent-child relation mein jude hote hai.
CSSOM Tree(CSS Object Model):-Jaise HTML ka DOM banta hai, waise hi saari CSS styles ka ek tree banta hai.
Render Tree:-DOM Tree + CSSOM Tree dono ko milakar jo final tree banta hai, usi ko Render Tree kehte hai.
Event Bubbling:-Jab aap kisi andar wale element (child) par click karte ho, toh uska event upar ki taraf (parent $\rightarrow$ grandparent) travel karta hai.
Event Capturing:- Yeh Event Bubbling ke bilkul ulta hota hai. Isme event sabse bade parent se shuru hokar us target (child) element tak niche jata hai.
Event Delegation:-Yeh ek technique hai jisme hum har ek chote child element par alag-alag event listener lagane ki jagah uske ek bade parent element par listener laga dete hai,jaise meine apne filter-buttons pe lagaya h
