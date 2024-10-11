function getYearFromSession(session) {
    return Number("20".concat(session.substring(0, 2)))
}

function transformHistory(id) {
    let result = {}
    result.yearMin = 3000
    result.yearMax = -3000
    result.history = new Map()
    for (let historyEntry of ghist[id]) {
        let session = historyEntry[0]
        let year = getYearFromSession(session)
        result.history.set(session, {
            session: session,
            link: historyEntry[1],
            year: year
        })
        if (year < result.yearMin) result.yearMin = year
        if (year > result.yearMax) result.yearMax = year
    }
    result.fullName = gsur[id] + " " + gname[id] + " " + gpatr[id]
    result.shortName = gname[id]
    return result
}

function run() {
    let idA = Number(document.getElementById("idA").value)
    let idB = Number(document.getElementById("idB").value)
    let showNonMatching = Number(document.getElementById("showNonMatching").checked)
    let histA = transformHistory(idA)
    let histB = transformHistory(idB)

    let text = ""
    text += "<div class='topWrapper'>"
    text += "<div class='leftElement'>" + histA.fullName + "</div>"
    text += "<div class='rightElement'>" + histB.fullName + "</div>"
    if (histA.yearMin > histB.yearMax) {
        text += "<div class='wideElement'>They haven't been to LKSh during the same time period: " +
            histB.shortName + " finished in " + histB.yearMax +
            ", and " + histA.shortName + " started in " + histA.yearMin + "</div>"
    } else if (histB.yearMin > histA.yearMax) {
        text += "<div class='wideElement'>They haven't been to LKSh during the same time period: " +
            histA.shortName + " finished in " + histA.yearMax +
            ", and " + histB.shortName + " started in " + histB.yearMin + "</div>"
    } else {
        let allSessions = new Set()
        for (let historyEvent of histA.history) allSessions.add(historyEvent[0])
        for (let historyEvent of histB.history) allSessions.add(historyEvent[0])
        let allSessionsOrdered = Array.from(allSessions)
        allSessionsOrdered.sort()
        let matchingYears = new Set()
        for (let session of allSessionsOrdered) {
            if (histA.history.has(session) && histB.history.has(session)) {
                let year = getYearFromSession(session)
                matchingYears.add(year)
            }
        }
        let lastYear = -1
        for (let session of allSessionsOrdered) {
            let year = getYearFromSession(session)
            if (year !== lastYear) {
                if (matchingYears.has(year)) {
                    text += "<div class='yearElement'><h2>" + year + "</h2></div>"
                } else {
                    if (showNonMatching) {
                        text += "<div class='yearElement'><h2 class='weak'>" + year + "</h2></div>"
                    }
                }
                lastYear = year
            }
            let dataA = histA.history.get(session)
            let dataB = histB.history.get(session)
            if (dataA !== undefined && dataB !== undefined) {
                text += "<div class='wideElement'><h3>" + glname[session] + "</h3></div>"
                text += "<div class='leftElement'><p>" + dataA.link + "</p></div>"
                text += "<div class='rightElement'><p>" + dataB.link + "</p></div>"
            } else if (dataA !== undefined) {
                if (showNonMatching) {
                    text += "<div class='leftElement'><h3 class='weak'>" + glname[session] + "</h3></div>"
                    text += "<div class='leftElement'><p class='weak'>" + dataA.link + "</p></div>"
                }
            } else if (dataB !== undefined) {
                if (showNonMatching) {
                    text += "<div class='rightElement'><h3 class='weak'>" + glname[session] + "</h3></div>"
                    text += "<div class='rightElement'><p class='weak'>" + dataB.link + "</p></div>"
                }
            }
        }
    }
    text += "</div>"

    document.getElementById("output").innerHTML = text
}