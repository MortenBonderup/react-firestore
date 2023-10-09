import './App.css'
import { useState, useEffect } from "react";
import { collection, addDoc, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from "./firebaseConfig";

function App() {

  const [data, setData] = useState([]);
  const [vare, setVare] = useState("");
  const [pris, setPris] = useState(0);
  const [sorteringsFelt, setSorteringsFelt] = useState("vare")

  /*
    Komponenten bruger useEffect til at hente data fra en Firebase Firestore-database. OnSnapshot-metoden lytter til ændringer i "shoppingliste"-samlingen og opdaterer komponentens tilstand med de nye data. FetchData-funktionen er en asynkron funktion, der henter dataene fra databasen og skubber dem ind i et array kaldet docs. ForEach-metoden bruges til at iterere over hvert dokument i dataene og skubbe det ind i docs-arrayet som et objekt med to egenskaber: id og data. Data sorteres efter valgte sorteringsfelt. Til sidst kaldes setData-metoden for at opdatere komponentens tilstand med de nye data. useEffect køres hver gang sorteringsfeltet ændres.
  */
  useEffect(() => {
    async function fetchData() {
      onSnapshot(collection(db, "shoppingliste"), data => {
        const docs = [];
        data.forEach((doc) => {
          docs.push({ id: doc.id, ...doc.data() });
        });
        console.log("useEffect");

        docs.sort(function (a, b) {
          if (a[sorteringsFelt] < b[sorteringsFelt]) {
            return -1;
          }
          if (a[sorteringsFelt] > b[sorteringsFelt]) {
            return 1;
          }
          return 0;
        });

        setData(docs);
      });
    }
    fetchData();
  }, [sorteringsFelt]);

  /*
  Koden herunder definerer en asynkron funktion opretVare, som tager et hændelsesobjekt ind som en parameter. Funktionen kaldes, når en formular sendes, og forhindrer hændelsens standardadfærd i at blive udført ved at kalde preventDefault() på hændelsesobjektet.
  
  Funktionen opretter et objekt nyvare med to egenskaber: vare og pris
  
  Derefter forsøger funktionen at tilføje dette objekt til databasen ved hjælp af addDoc-funktionen fra Firebase Firestore. Hvis det lykkes, vil funktionen logge en meddelelse til konsollen, der angiver, at elementet blev tilføjet til databasen sammen med dokumentets ID. Hvis der opstår en fejl, vil funktionen logge en fejlmeddelelse til konsollen, der angiver, at elementet ikke kunne tilføjes til databasen og giver information om fejlen.
  */
  async function opretVare(e) {
    e.preventDefault();

    const nyvare = {
      vare: vare,
      pris: pris
    }

    try {
      const vareRef = await addDoc(collection(db, "shoppingliste"), nyvare);
      console.log("Vare tilføjet med ID: ", vareRef.id);
    } catch (e) {
      console.error("FEJL - Kunne ikke tilføje vare: ", e);
    }
  }

  /*
  Koden herunder definerer en asynkron funktion sletVare, som tager et hændelsesobjekt som en parameter. Funktionen henter data-id-attributten fra hændelsesobjektet og gemmer den i variablen itemId.
  
  Derefter forsøger funktionen at slette dokumentet med ID itemId fra databasen ved hjælp af deleteDoc-funktionen fra Firebase Firestore. Hvis det lykkes, vil funktionen logge en besked til konsollen, der angiver, at elementet blev slettet. Hvis der opstår en fejl, vil funktionen logge en fejlmeddelelse til konsollen, der angiver, at dokumentet ikke kunne slettes, og giver information om fejlen.
  */
  async function sletVare(e) {
    const vareId = e.currentTarget.getAttribute("data-id");

    try {
      const vareRef = doc(db, "shoppingliste", vareId);
      await deleteDoc(vareRef);
      console.log("Varen blev slettet!");
    } catch (e) {
      console.error("FEJL - kunne ikke slette dokument: ", e);
    }
  }


  // De følgende to funktioner skifter sorteringsfelt.
  function sorterEfterVare() {
    setSorteringsFelt("vare");
  }

  function sorterEfterPris() {
    setSorteringsFelt("pris");
  }

  /*
  Koden herunder definerer en komponent, der viser en indkøbsliste og en formular til tilføjelse af nye varer til listen.
   
  Komponenten bruger dataarrayet til at generere en liste over varer på indkøbslisten ved hjælp af kortmetoden. Hver vare vises som en listepost med navn og pris, samt en knap til at slette varen fra listen. Knappen har en onClick-hændelse, der kalder sletVare-funktionen.
   
  Formularen til at tilføje nye elementer til listen bruger hændelsen onSubmit til at kalde funktionen opretVare. Formularen har to tekstfelter til at tilføje navn og pris på varen, samt en knap til at tilføje varen til listen.
   
  Begge funktioner opretVare og sletVare er defineret tidligere i koden og bruges til at tilføje eller slette elementer fra databasen.
  */
  return (
    <div>
      <button type="button" onClick={sorterEfterPris}>Sorter efter pris</button>
      <button type="button" onClick={sorterEfterVare}>Sorter efter vare</button>
      <h2>Shoppingliste:</h2>
      <ul>
        {data.map((item) => (
          <li key={item.id} style={{ "listStyleType": "none" }}>
            <span style={{ "marginRight": "10px" }}>{item.vare}</span>
            <span style={{ "marginRight": "10px" }}>{item.pris}</span>
            <button type="button" data-id={item.id} onClick={sletVare}>Slet</button>
          </li>
        ))}
      </ul>

      <form onSubmit={opretVare}>
        <h2>Opret vare</h2>
        <label>Vare: </label><input type="text" value={vare} onChange={e => setVare(e.target.value)} required />
        <label>Pris: </label><input type="number" value={pris} onChange={e => setPris(e.target.value)} required />
        <button>Tilføj til shoppingliste</button>
      </form>
    </div>
  );
}


export default App;
