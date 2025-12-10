import './RulesPanel.css';

/**
 * Panel displaying the game rules in Dutch.
 */
export function RulesPanel() {
  const rules = [
    'Je mag een nieuw cadeau uitpakken of je steelt een cadeau dat al is uitgepakt',
    'Je hebt 15 seconden om te kiezen of je een al uitgepakt cadeau steelt',
    'Pak het cadeau uit zodat iedereen het goed kan zien',
    'Er mag maximaal 3 keer een cadeau van iemand worden gestolen',
    'Na de eerste ronde kun je je cadeau beschermen - dan mag je eerder weg',
  ];

  return (
    <div className="rules-panel">
      <h3 className="rules-title">
        <span className="rules-icon">📜</span>
        Spelregels
      </h3>
      <ol className="rules-list">
        {rules.map((rule, index) => (
          <li key={index} className="rules-item">
            {rule}
          </li>
        ))}
      </ol>
    </div>
  );
}
