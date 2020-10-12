# XS-Search Attacks
Cross-site search attacks allow a rogue website to expose private, sensitive user-information from web applications. The attacker exploits timing and other side channels to extract the information, using cleverly-designed cross-site queries.
https://www.researchgate.net/publication/344503497_Cross-Site_Search_Attacks_Unauthorized_Queries_over_Private_Data

# Reproducibility System
In this repo you can find several xs-search attack scripts that we use in our reproducibility system.
You can download our reproducibility vm on <a href="https://uconn-my.sharepoint.com/:f:/g/personal/amir_herzberg_uconn_edu1/Em06gpKEq9ZDuirdSg6xbZoBqNdb2iJQQpTM7-28ZDdJgg?e=WKbkqH"> link </a>.

# Reproducibility System details:
Web services tend to get updates often and change their API. To ensure the reproducibility of our experiments despite these challenges, we set up an infrastructure that is not dependent on external web-services. This infrastructure was built on a virtual machine that consists of all the technologies necessary to perform XS-Search attacks:
1. Local mail service that allows cross-site search requests and supports simple and complex queries. To simulate real mailboxes of users we used the Enron dataset, which contains data from about 150 users, mostly senior management of the Enron corporation.
2. Service that simulates real network conditions including drop and delay.
3. Web service that presents the results of the search requests in a user-friendly interface.
4. Service that simulates cross-site attacks and allows performing XS-Search attacks. We implemented three XS-Search attacks: Network Time (NT), Cache Time (CT), and Length Based (LB). 

# Scripts details:
1. LB-XS-Search - Chrome Exploit - CVE-2020-6442
2. flash_vulnerability - Flash Exploit - CVE-2019-8075
