# Content

## Expandable variables

In the title and body portion of the content, expandable variables can be used. These are
enterad using handlebar notation. eg {{ eventsFromStart.totalCollects }}

| name                    | description                                                                       |
| ----------------------- | --------------------------------------------------------------------------------- |
| **EVENTS**              | Prefix with eventsFromStart or eventsThisYear (e.g {{ eventsThisYear.totalCo2 }}) |
| totalCo2                | The aggregated number of co2 equivalents saved within timeframe                   |
| totalCollects           | The total number of collects made within timeframe                                |
| totalValue              | The aggregated value of all collects within timeframe                             |
| **ADVERTS**             | Prefix with advertSummaries (e.g {{ advertSummaries.totalLendingAdverts }})       |
| totalLendingAdverts     | The total number of lending adverts currently in repository, archived excluded    |
| totalRecycleAdverts     | The total number of lending adverts currently in repository, archived excluded    |
| availableLendingAdverts | The number of adverts currently available for lending                             |
| availableRecycleAdverts | The number of adverts currently available for recycling                           |
| availableAdverts        | The number of adverts currently available for recycling and ledning               |
| totalAdverts            | The total number of adverts currently in repository, archived excluded            |
| collectedAdverts        | The number of adverts that are currently collected                                |
| reservedAdverts         | The number of adverts that are currently reserved                                 |
