## SOMPS
### Summer Of Making Project Search

Allows searching for projects inside the Hackclub Summer Of Making Program

Submission to Summer of Making and Reactive

## Project:
### /backend
Contains the backend structure that is used to download and update the project list
### /frontend
Contains a frontend react+nextjs interface that allows the searching

## Uses:
The SOM API

JSON Bin to store the project list

React + NextJS

My Brain

## Devlog:
### [6/24/2025]
Starting with backend, we fetch the project list from the SOM API, we fetch the list of all hackclub slack users, and we incorporate all users names into the project list
This will allow searching by author name
Creating getbanners.js, that uses the pages browse endpoint to fetch all project banners
-- Didnt sleep between here --
### [6/25/2025]
Created index.js to get all users, get banner images, and merge them with projects.json, to create, the one, the legendary, FINALPROJECTS.JSON !!!!!!!!!!!!
End of Backend ig
Created frontend setup
Created frontend page, search page
At night:
Created the entire search algorithm (implemented from Alimad Surviellance)
The search engine basically has a goal to give the most relevant project.
This is done by assigning a score to each project, and then sorting by that score.
A project has many properties like name, author name, id, etc.
And it also has a bunch of low priority things like description, region, etc.
Alimad Search Engine merges all of them into an index, divides each index key by splitting with " ".
Then it splits the query with " ", and then filters all arrays for duplicates.
Next, a two dimensional loop compares each query word with each index word according to the following: 
    > If the query word is equal to the index word: add a score of 25
    > If the query word is contained in the index word: add a score of 20
    > If the levenshtein distance between the query word and the index word is less than 3: add a score of 10
    > Repeat for low priority index with half the scores, but dont compare levenshtein distances
Then an approximate median is calculated by averaging the max and min value, adding them to the min value,
and then by filtering any projects below the mid value.
Then the projects are sorted using quick sort, and viola! We have our results.
This algorithm was designed by me three months ago.
### [6/26/2025]
Did some finishes, added stats page, improved UI, and followed all the requirements for Reactive:
[x] Make at least three pages that link to each other (/, /search and /about)
[x] Make a nested route (/api/project/[id])
[x] Use at least 5 components (about-content, containter, loading, projectCard, searchContent, stats, dropdown)
[x] One of those components should accept children (container)
[x] One of those components should accept props (projectCard, stats)
[x] Have a nested component (/about has nested <container>s)
[x] Create a component that fetches and displays data from an API (/about fetches from /api/stats)

And with that, I call this project finished, with just some things left to do:
[x] Create a sort by field

Open Source. Alimad Corporations. All rights reserved.
Made by Muhammad Ali