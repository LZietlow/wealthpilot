

const categoryKeywords: Record<string, string[]> = {
    'Lebensmittel': ['Aldi', 'Rewe', 'Edeka', 'Penny', 'Netto', 'Lidl', 'Kaufland', 'Supermarkt', 'Baecker', 'Baeckerei'],
    'Miete': ['Miete', 'Dauerauftrag Miete', 'Kaltmiete', 'Warmmiete', 'Vermieter', 'Hausverwaltung', 'Nebenkosten'],
    'Gehalt': ['Gehalt', 'Lohn', 'Bezuege', 'Entgelt', 'Rente', 'Bafoeg', 'Kindergeld', 'Krankengeld', 'Einkommen', 'Honorar'],
    'Kleidung': ['H&M', 'Zara', 'C&A', 'Zalando', 'About You', 'Adidas', 'Nike', 'Snipes', 'Bekleidung', 'Schuhe', 'Mode'],
    'Sport': ['McFit', 'FitX', 'Clever Fit', 'Fitnessstudio', 'Fitness', 'Gym', 'Sportverein', 'Turnverein'],
    'Unterhaltung': ['Netflix', 'Spotify', 'Disney', 'Amazon Prime', 'DAZN', 'Youtube', 'Kino', 'Eventim', 'Playstation', 'Steam'],
    'Transport': ['Deutsche Bahn', 'DV Vertrieb', 'S-Bahn', 'U-Bahn', 'Bus', 'Aral', 'Shell', 'Total', 'Esso', 'Jet', 'Tankstelle', 'Uber', 'Taxi'],
    'Kredit': ['Kredit', 'Darlehen', 'Tilgung', 'Baufinanzierung', 'Ratenkredit', 'Santander', 'Barclays', 'Targobank', 'Commerzbank'],
    'Freizeit': ['Restaurant', 'Cafe', 'Bar', 'Kneipe', 'Pizzeria', 'Schwimmbad', 'Therme', 'Zoo', 'Hotel', 'Booking'],
    'Sonstiges': ['Barabhebung', 'Geldautomat', 'ATM', 'Cash', 'Apotheke', 'Drogerie', 'DM', 'Rossmann', 'Amazon', 'Paypal', 'Steuer']
}


export default function suggestCategory(description: string): string | null {

    for (const [category, keywords] of Object.entries(categoryKeywords)) {
        
        const found = keywords.some(keyword =>
            description.toLowerCase().includes(keyword.toLowerCase())
        );

        if(found) {
            return category;
        }
    }

    return null;

}