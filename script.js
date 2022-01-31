const btn = document.querySelector(".btn")
const route = document.querySelector(".route");
const startDate = document.querySelector(".start-date")
const endDate = document.querySelector(".end-date")
const errMsg = document.querySelector(".err-msg")
const result = document.querySelector(".result")
const totDays=document.querySelector(".tot-days")
const routeMap = {
    Tirunelveli: {
        Madurai: 2
    },
    Madurai: {
        Tirunelveli: 2,
        Trichy: 2,
        Coimbatore: 3,
        Salem: 3,
    },
    Trichy: {
        Chennai: 3
    },
    Coimbatore: {
        Chennai: 3,
        Bangalore: 3
    },
    Salem: {
        Bangalore: 2
    },
    Bangalore: {
        Mumbai: 3
    },
    Chennai: {
        Bangalore: 2,
        Mumbai: 5
    },
    Mumbai: {}
};
const tracePath = (table, start, end) => {
    try {
        var path = [];
        var next = end;
        while (true) {
            path.unshift(next);
            if (next === start) {
                break;
            }
            next = table[next].travelTo;
        }

        return path;
    } catch (err) {
        errMsg.classList.remove('hidden');
    }
};

const formatRouteMap = (g) => {
    const tmp = {};
    Object.keys(g).forEach((k) => {
        const obj = g[k];
        const arr = [];
        Object.keys(obj).forEach((v) => arr.push({
            travelTo: v,
            travelDistance: obj[v]
        }));
        tmp[k] = arr;

    });
    return tmp;
};

const shortPath = (routeMap, start, end) => {
    var map = formatRouteMap(routeMap);
    var visited = [];
    var unvisited = [start];
    var shortestDistances = {
        [start]: {
            travelTo: start,
            travelDistance: 0
        }
    };

    var travelTo;
    while ((travelTo = unvisited.shift())) {
        // Explore unvisited neighbors
        var neighbors = map[travelTo].filter((n) => !visited.includes(n.travelTo));
        // Add neighbors to the unvisited list
        unvisited.push(...neighbors.map((n) => n.travelTo));

        var travelDistTotravelTo = shortestDistances[travelTo].travelDistance;
        for (let {
                travelTo: to,
                travelDistance
            } of neighbors) {
            var currTravelDistanceToNeighbor = shortestDistances[to] && shortestDistances[to].travelDistance;
            var newTravelDistanceToNeighbor = travelDistTotravelTo + travelDistance;
            if (
                currTravelDistanceToNeighbor == undefined ||
                newTravelDistanceToNeighbor < currTravelDistanceToNeighbor
            ) {
                // Update the table
                shortestDistances[to] = {
                    travelTo,
                    travelDistance: newTravelDistanceToNeighbor
                };
            }
        }

        visited.push(travelTo);
    }

    const path = tracePath(shortestDistances, start, end);
    const totalDays = shortestDistances[end].travelDistance;
    const today = new Date().toLocaleDateString();
    const todayTS = new Date().getTime();
    const arrivalTS = todayTS + (totalDays * 24 * 60 * 60 * 1000);
    const arrivalDate = new Date(arrivalTS).toLocaleDateString();
    console.log(path.join(" -> "), " travel days ", shortestDistances[end].travelDistance);

    result.classList.remove('hidden');
    totDays.innerHTML=shortestDistances[end].travelDistance;
    route.innerHTML = `${path.join(`&emsp; <i class="fas fa-angle-double-right"></i> &emsp;`)}`
    startDate.innerHTML = today;
    endDate.innerHTML = arrivalDate;

};

btn.addEventListener('click', () => {
    result.classList.add('hidden');
    errMsg.classList.add('hidden')
    const from = document.querySelector(".from")
    const to = document.querySelector(".to")
    shortPath(routeMap, from.value, to.value);
})