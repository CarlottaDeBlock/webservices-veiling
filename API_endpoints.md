# Veiling API Endpoints

## Users
- `GET /api/users`  
  Haal alle gebruikers op  
  Response: JSON array van gebruikers

- `GET /api/users/:id`  
  Haal specifieke gebruiker op  
  Response: JSON gebruiker object

- `POST /api/users`  
  Maak nieuwe gebruiker aan  
  Body: JSON gebruiker data  
  Response: Aangemaakte gebruiker object

- `PUT /api/users/:id`  
  Een bedrijf aanpassen 

- `DELETE /api/users/:id`  
  Een bedrijf verwijderen 

- `GET /api/users/:id/auctions`  
  Auctions van een specifieke gebruiker opvragen 

- `GET /api/users/:id/bids`  
  Biedingen van een specifieke gebruiker opvragen 

- `GET /api/users/:id/reviews`  
  Reviews van een specifieke gebruiker opvragen 

## Companies
- `GET /api/companies`  
  Haal alle bedrijven op  
  Response: JSON array van bedrijven

- `GET /api/companies/:id`  
  Specifiek bedrijf opvragen  
  Response: JSON array van bedrijven

- `POST /api/companies`  
  Maak nieuwe bedrijf aan 
  Body: JSON bedrijf data  
  Response: Aangemaakte bedrijf object

- `PUT /api/companies/:id`  
  Een bedrijf aanpassen 

- `DELETE /api/companies/:id`  
  Een bedrijf verwijderen 

- `GET /api/companies/:id/contracts`  
  Contracts van een specifieke bedrijf opvragen 

- `GET /api/companies/:id/invoices`  
  Facturen van een specifieke bedrijf opvragen 

## Auctions
- `GET /api/auctions`  
  Haal alle veilingen op (opties filteren via query params category, status)  
  Response: JSON array van veilingen

- `GET /api/auctions/:id`  
  Haal specifieke veiling op  
  Response: JSON veiling object

- `POST /api/auctions`  
  Maak veiling aan  
  Body: JSON veiling data  
  Response: Aangemaakte veiling

- `DELETE /api/auctions/:id`  
  Een veiling verwijderen 

## Bids
- `POST /api/bids`  
  Plaats nieuw bod  
  Body: JSON bod data (auction_id, bidder_id, amount)  
  Response: Nieuw bod object

- `GET /api/bids/auction/:id`  
  Haal biedingen van veiling op  
  Response: Array van biedingen

## Contracts
- `GET /api/contracts`  
  Haal contracten op

- `POST /api/contracts`  
  Maak contract aan (na veiling gewonnen)  
  Body: JSON contract details

## Invoices
- `GET /api/invoices`  
  Haal facturen op

- `POST /api/invoices`  
  Maak factuur aan

## Reviews
- `GET /api/reviews`  
  Haal reviews op

- `POST /api/reviews`  
  Voeg review toe
