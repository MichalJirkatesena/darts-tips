import { useState, useEffect } from "react";
import { database } from "./firebase";
import { ref, onValue, set } from "firebase/database";

import AdaAvatar from "./avatars/Ada.png";
import JelinoAvatar from "./avatars/Jelino.png";
import JedlaAvatar from "./avatars/Jedla.png";
import MisaAvatar from "./avatars/Misa.png";

const MATCHES = [
  // Thursday December 11
  { id: 1, p1: "Kim Huybrechts", p2: "Arno Merk" },
  { id: 2, p1: "Michael Smith", p2: "Lisa Ashton" },
  { id: 3, p1: "Luke Littler", p2: "Darius Labanauskas" },
  { id: 4, p1: "Madars Razma", p2: "Jamai van den Herik" },

  // Friday December 12 – Afternoon Session
  { id: 5, p1: "Niels Zonneveld", p2: "Haupai Puha" },
  { id: 6, p1: "Ian White", p2: "Mervyn King" },
  { id: 7, p1: "Ryan Searle", p2: "Chris Landman" },
  { id: 8, p1: "Rob Cross", p2: "Cor Dekker" },

  // Friday December 12 – Evening Session
  { id: 9, p1: "Ross Smith", p2: "Andreas Harrysson" },
  { id: 10, p1: "Ricky Evans", p2: "Man Lok Leung" },
  { id: 11, p1: "Gian van Veen", p2: "Cristo Reyes" },
  { id: 12, p1: "Damon Heta", p2: "Steve Lennon" },

  // Saturday December 13 – Afternoon Session
  { id: 13, p1: "Mario Vandenbogaerde", p2: "David Davies" },
  { id: 14, p1: "Andrew Gilding", p2: "Cam Crabtree" },
  { id: 15, p1: "Luke Woodhouse", p2: "Boris Krcmar" },
  { id: 16, p1: "Gary Anderson", p2: "Adam Hunt" },

  // Saturday December 13 – Evening Session
  { id: 17, p1: "Jeffrey de Graaf", p2: "Paul Lim" },
  { id: 18, p1: "Wessel Nijman", p2: "Karel Sedlacek" },
  { id: 19, p1: "Luke Humphries", p2: "Ted Evetts" },
  { id: 20, p1: "Gabriel Clemens", p2: "Alex Spellman" },

  // Sunday December 14 – Afternoon Session
  { id: 21, p1: "Ritchie Edhouse", p2: "Jonny Tata" },
  { id: 22, p1: "Dom Taylor", p2: "Oskar Lukasiak" },
  { id: 23, p1: "Richard Veenstra", p2: "Nitin Kumar" },
  { id: 24, p1: "Joe Cullen", p2: "Bradley Brooks" },

  // Sunday December 14 – Evening Session
  { id: 25, p1: "Lukas Wenig", p2: "Wesley Plaisier" },
  { id: 26, p1: "Dimitri Van den Bergh", p2: "Darren Beveridge" },
  { id: 27, p1: "Stephen Bunting", p2: "Sebastian Bialecki" },
  { id: 28, p1: "James Hurrell", p2: "Stowe Buntz" },

  // Monday December 15 – Afternoon Session
  { id: 29, p1: "Brendan Dolan", p2: "Tavis Dudeney" },
  { id: 30, p1: "Cameron Menzies", p2: "Charlie Manby" },
  { id: 31, p1: "Mensur Suljovic", p2: "David Cameron" },
  { id: 32, p1: "Peter Wright", p2: "Noa-Lynn van Leuven" },

  // Monday December 15 – Evening Session
  { id: 33, p1: "Martin Lukeman", p2: "Max Hopp" },
  { id: 34, p1: "Dirk van Duijvenbode", p2: "Andy Baetens" },
  { id: 35, p1: "Jonny Clayton", p2: "Adam Lipscombe" },
  { id: 36, p1: "Connor Scutt", p2: "Simon Whitlock" },

  // Tuesday December 16 – Afternoon Session
  { id: 37, p1: "Alan Soutar", p2: "Teemu Harju" },
  { id: 38, p1: "Nick Kenny", p2: "Justin Hood" },
  { id: 39, p1: "Scott Williams", p2: "Paolo Nebrida" },
  { id: 40, p1: "Chris Dobey", p2: "Xiaochen Zong" },

  // Tuesday December 16 – Evening Session
  { id: 41, p1: "Ricardo Pietreczko", p2: "Jose de Sousa" },
  { id: 42, p1: "Danny Noppert", p2: "Jurjen van der Velde" },
  { id: 43, p1: "Gerwyn Price", p2: "Adam Gawlas" },
  { id: 44, p1: "Niko Springer", p2: "Joe Comito" },

  // Wednesday December 17 – Evening Session
  { id: 45, p1: "Matt Campbell", p2: "Adam Sevada" },
  { id: 46, p1: "Raymond van Barneveld", p2: "Stefan Bellmont" },
  { id: 47, p1: "James Wade", p2: "Ryusei Azemoto" },
  { id: 48, p1: "Martin Schindler", p2: "Stephen Burton" },

  // Thursday December 18 – Afternoon Session
  { id: 49, p1: "Callan Rydz", p2: "Patrik Kovacs" },
  { id: 50, p1: "Thibault Tricole", p2: "Motomu Sakai" },
  { id: 51, p1: "Ryan Joyce", p2: "Owen Bates" },
  { id: 52, p1: "Mike De Decker", p2: "David Munyua" },

  // Thursday December 18 – Evening Session
  { id: 53, p1: "Jermaine Wattimena", p2: "Dominik Gruellich" },
  { id: 54, p1: "Dave Chisnall", p2: "Fallon Sherrock" },
  { id: 55, p1: "Michael van Gerwen", p2: "Mitsuhiko Tatsunami" },
  { id: 56, p1: "Krzysztof Ratajski", p2: "Alexis Toylo" },

  // Friday December 19 – Afternoon Session
  { id: 57, p1: "Kevin Doets", p2: "Matthew Dennant" },
  { id: 58, p1: "Ryan Meikle", p2: "Jesus Salate" },
  { id: 59, p1: "Mickey Mansell", p2: "Leonard Gates" },
  { id: 60, p1: "Josh Rock", p2: "Gemma Hayter" },

  // Friday December 19 – Evening Session
  { id: 61, p1: "William O'Connor", p2: "Krzysztof Kciuk" },
  { id: 62, p1: "Daryl Gurney", p2: "Beau Greaves" },
  { id: 63, p1: "Nathan Aspinall", p2: "Lourence Ilagan" },
  { id: 64, p1: "Keane Barry", p2: "Tim Pusey" },

  // 2nd round
  { id: 65, p1: "Ryan Searle", p2: "Brendan Dolan" },
  { id: 66, p1: "Andreas Harrysson", p2: "Motomu Sakai" },
  { id: 67, p1: "Dirk van Duijvenbode", p2: "James Hurrell" },
  { id: 68, p1: "Dave Chisnall", p2: "Ricardo Pietreczko" },

  { id: 69, p1: "Michael Smith", p2: "Niels Zonneveld" },
  { id: 70, p1: "Chris Dobey", p2: "Andrew Gilding" },
  { id: 71, p1: "Stephen Bunting", p2: "Nitin Kumar" },
  { id: 72, p1: "Jonny Clayton", p2: "Dom Taylor" },

  { id: 73, p1: "Ryan Joyce", p2: "Krzysztof Ratajski" },
  { id: 74, p1: "Joe Cullen", p2: "Mensur Suljovic" },
  { id: 75, p1: "Luke Woodhouse", p2: "Max Hopp" },
  { id: 76, p1: "Rob Cross", p2: "Ian White" },

  { id: 77, p1: "Martin Schindler", p2: "Keane Barry" },
  { id: 78, p1: "Gerwyn Price", p2: "Wesley Plaisier" },
  { id: 79, p1: "Luke Littler", p2: "David Davies" },
  { id: 80, p1: "Damon Heta", p2: "Stefan Bellmont" },

  { id: 81, p1: "Darren Beveridge", p2: "Madars Razma" },
  { id: 82, p1: "Wessel Nijman", p2: "Gabriel Clemens" },
  { id: 83, p1: "David Munyua", p2: "Kevin Doets" },
  { id: 84, p1: "James Wade", p2: "Ricky Evans" },

  { id: 85, p1: "Gian van Veen", p2: "Alan Soutar" },
  { id: 86, p1: "Nathan Aspinall", p2: "Leonard Gates" },
  { id: 87, p1: "Luke Humphries", p2: "Paul Lim" },
  { id: 88, p1: "Charlie Manby", p2: "Adam Sevada" },

  { id: 89, p1: "Jonny Tata", p2: "Ryan Meikle" },
  { id: 90, p1: "Daryl Gurney", p2: "Callan Rydz" },
  { id: 91, p1: "Jermaine Wattimena", p2: "Scott Williams" },
  { id: 92, p1: "Peter Wright", p2: "Arno Merk" },

  { id: 93, p1: "Danny Noppert", p2: "Justin Hood" },
  { id: 94, p1: "Gary Anderson", p2: "Connor Scutt" },
  { id: 95, p1: "Michael van Gerwen", p2: "William O’Connor" },
  { id: 96, p1: "Josh Rock", p2: "Joe Comito" },

  // 3rd round
  { id: 97,  p1: "Wesley Plaisier",    p2: "Krzysztof Ratajski" },
  { id: 98,  p1: "Andrew Gilding",     p2: "Luke Woodhouse" },
  { id: 99,  p1: "Jonny Clayton",      p2: "Niels Zonneveld" },
  { id: 100, p1: "Andreas Harrysson",  p2: "Ricardo Pietreczko" },
  { id: 101, p1: "Stephen Bunting",    p2: "James Hurrell" },
  { id: 102, p1: "Luke Littler",       p2: "Mensur Suljovic" },

  { id: 103, p1: "Martin Schindler",   p2: "Ryan Searle" },
  { id: 104, p1: "Damon Heta",         p2: "Rob Cross" },
  { id: 105, p1: "Gary Anderson",      p2: "Jermaine Wattimena" },
  { id: 106, p1: "Gian van Veen",      p2: "Madars Razma" },
  { id: 107, p1: "Luke Humphries",     p2: "Gabriel Clemens" },
  { id: 108, p1: "Michael van Gerwen", p2: "Arno Merk" },

  { id: 109, p1: "Ryan Meikle",        p2: "Justin Hood" },
  { id: 110, p1: "Ricky Evans",        p2: "Charlie Manby" },
  { id: 111, p1: "Nathan Aspinall",    p2: "Kevin Doets" },
  { id: 112, p1: "Josh Rock",          p2: "Callan Rydz" },
  // 4th round
  { id: 113, p1: "James Hurrell",         p2: "Ryan Searle" },
  { id: 114, p1: "Luke Littler",          p2: "Rob Cross" },
  { id: 115, p1: "Luke Woodhouse",        p2: "Krzysztof Ratajski" },
  { id: 116, p1: "Jonny Clayton",         p2: "Andreas Harrysson" },
  { id: 117, p1: "Luke Humphries",        p2: "Kevin Doets" },
  { id: 118, p1: "Charlie Manby",         p2: "Gian van Veen" },
  { id: 119, p1: "Michael van Gerwen",    p2: "Gary Anderson" },
  { id: 120, p1: "Justin Hood",           p2: "Josh Rock" },
  // Quaterfinals
  { id: 121, p1: "Ryan Searle",       p2: "Jonny Clayton" },
  { id: 122, p1: "Gary Anderson",     p2: "Justin Hood" },
  { id: 123, p1: "Luke Littler",      p2: "Krzysztof Ratajski" },
  { id: 124, p1: "Luke Humphries",    p2: "Gian van Veen" },
  // Semifinals
  { id: 125, p1: "Ryan Searle",       p2: "Luke Littler" },
  { id: 126, p1: "Gary Anderson",     p2: "Gian van Veen" },
];

const USERS = [
  { name: "Áda", avatar: AdaAvatar },
  { name: "Jelíno", avatar: JelinoAvatar },
  { name: "Jedla", avatar: JedlaAvatar },
  { name: "Míša", avatar: MisaAvatar },
];

export default function App() {
  const [user, setUser] = useState("");
  const [activeTab, setActiveTab] = useState("tipy");
  const [tips, setTips] = useState({});
  const [results, setResults] = useState({});

  useEffect(() => {
    const tipsRef = ref(database, "tips");
    onValue(tipsRef, (snapshot) => setTips(snapshot.val() || {}));

    const resultsRef = ref(database, "results");
    onValue(resultsRef, (snapshot) => setResults(snapshot.val() || {}));
  }, []);

  const handleTip = (matchId, player) => {
    if (!user) return alert("Nejdříve vyberte hráče!");
    set(ref(database, `tips/${user}/${matchId}`), player);
  };

  const handleResult = (matchId, player) => {
    set(ref(database, `results/${matchId}`), player);
  };

  const renderPlayerButton = (player, selected, onClick) => (
    <button
      className={`flex-1 py-2 px-4 rounded-lg font-semibold border transition-colors
        ${selected ? "bg-blue-500 text-white border-blue-600" : "bg-white text-blue-700 border-gray-300 hover:bg-blue-200"}`}
      onClick={onClick}
    >
      {player}
    </button>
  );

  const getTipColor = (tip, result) => {
    if (!tip || !result) return "bg-white border-gray-300";
    return tip === result ? "bg-green-200 border-green-400" : "bg-red-200 border-red-400";
  };

  const computeRanking = () => {
    return USERS.map(u => {
      let wins = 0;
      let losses = 0;
      MATCHES.forEach(m => {
        const tip = tips[u.name]?.[m.id];
        const result = results[m.id];
        if (!tip || !result) return;
        if (tip === result) wins++;
        else losses++;
      });
      return { user: u.name, wins, losses };
    }).sort((a,b) => b.wins - a.wins || a.losses - b.losses);
  };

  return (
    <div className="min-h-screen bg-blue-100 flex flex-col md:flex-row p-6">
      {/* Levý panel */}
      <div className="w-full md:w-1/5 mb-6 md:mb-0 md:mr-6 flex flex-col h-full">
        <div>
          {/* Tipy */}
          <button
            className={`w-full py-2 px-4 rounded-lg font-semibold border transition-colors ${
              activeTab === "tipy"
                ? "bg-blue-500 text-white border-blue-600"
                : "bg-white text-blue-700 border-blue-300 hover:bg-blue-200"
            }`}
            onClick={() => setActiveTab("tipy")}
          >
            Tipy
          </button>

          {/* Seznam tipujících s avatar */}
          {activeTab === "tipy" && (
            <div className="flex flex-col gap-3 mt-2">
              {USERS.map(u => (
                <button
                  key={u.name}
                  className={`py-2 px-4 rounded-full font-semibold border transition-colors flex items-center gap-2 ${
                    user === u.name
                      ? "bg-blue-500 text-white border-blue-600"
                      : "bg-white text-blue-700 border-blue-300 hover:bg-blue-200"
                  }`}
                  onClick={() => setUser(u.name)}
                >
                  <img
                    src={u.avatar}
                    alt={u.name}
                    className="w-8 h-8 rounded-full border border-gray-300"
                  />
                  <span>{u.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Oddělovač a další záložky */}
        <div className="flex-1" />
        <div className="mt-4 pt-4 border-t border-gray-300 flex flex-col gap-2">
          <button
            className={`w-full py-2 px-4 rounded-lg font-semibold border transition-colors ${
              activeTab === "vysledky"
                ? "bg-blue-500 text-white border-blue-600"
                : "bg-white text-blue-700 border-blue-300 hover:bg-blue-200"
            }`}
            onClick={() => setActiveTab("vysledky")}
          >
            Zadávání výsledků
          </button>

          <button
            className={`w-full py-2 px-4 rounded-lg font-semibold border transition-colors ${
              activeTab === "zebricek"
                ? "bg-blue-500 text-white border-blue-600"
                : "bg-white text-blue-700 border-blue-300 hover:bg-blue-200"
            }`}
            onClick={() => setActiveTab("zebricek")}
          >
            Žebříček
          </button>
        </div>
      </div>

      {/* Pravý panel */}
      <div className="flex-1 flex flex-col">
        <h1 className="text-3xl font-bold text-blue-800 mb-6">
          Tipovačka – MS v šipkách 2025/26
        </h1>

        <div className="flex-1 overflow-auto">
          {/* Tipy */}
          {activeTab === "tipy" && user && (
            <div className="grid gap-4 mb-10">
              {MATCHES.map(m => {
                const tip = tips[user]?.[m.id];
                const result = results[m.id];
                const cardColor = getTipColor(tip, result);
                return (
                  <div key={m.id} className={`p-4 rounded-2xl shadow-lg border transition-all ${cardColor}`}>
                    <div className="text-lg font-semibold mb-2">{m.p1} vs {m.p2}</div>
                    <div className="flex gap-2">
                      {renderPlayerButton(m.p1, tip === m.p1, () => handleTip(m.id, m.p1))}
                      {renderPlayerButton(m.p2, tip === m.p2, () => handleTip(m.id, m.p2))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Zadávání výsledků */}
          {activeTab === "vysledky" && (
            <div className="grid gap-4 mb-10">
              {MATCHES.map(m => (
                <div key={m.id} className="p-4 rounded-2xl shadow-lg border border-gray-300 bg-white">
                  <div className="text-lg font-semibold mb-2">{m.p1} vs {m.p2}</div>
                  <div className="flex gap-2">
                    {renderPlayerButton(m.p1, results[m.id] === m.p1, () => handleResult(m.id, m.p1))}
                    {renderPlayerButton(m.p2, results[m.id] === m.p2, () => handleResult(m.id, m.p2))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Žebříček */}
          {activeTab === "zebricek" && (
            <div className="mt-2">
              <h2 className="text-xl font-semibold mb-2">Žebříček hráčů</h2>
              <ul className="grid gap-2">
                {computeRanking().map((r, idx) => (
                  <li key={r.user} className="p-3 border rounded-lg bg-white flex justify-between">
                    <span>{idx + 1}. {r.user}</span>
                    <span className="font-semibold text-green-600">{r.wins} ✅</span>
                    <span className="font-semibold text-red-600">{r.losses} ❌</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}