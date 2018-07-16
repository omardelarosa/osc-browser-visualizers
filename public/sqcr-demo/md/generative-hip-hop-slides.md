class: center, middle
iframeURL: /public/sqcr-demo/html/808.html
iframeSelector: .frame-808-1

# Making Self-Generating Hip Hop in JS

<iframe src="/blank.html" width="0" height="0" class="frame-808-1" frameborder="0"></iframe>

---

class: center, middle

# What is Music?

---

class: center, middle

# Organized Sound Waves

## (Technically)

<img src="https://banner2.kisspng.com/20180406/wuw/kisspng-sine-wave-square-wave-waveform-sound-wave-5ac767ad185f97.7005774115230176450998.jpg" width=400 />

---

class: center, middle

### One Way To Do Music Randomly...

---

class: center, middle
iframeURL: http://localhost:8081/public/sqcr-demo/html/random-tones.html
iframeSelector: .random-tones-frame

### Random Tone Frequencies

<iframe class="random-tones-frame" width="100%" src="/blank.html" frameborder=0></iframe>

---

class: center, middle

### Yuck.

---

class: center, middle

## Can We Do Better?

---

class: center, middle

iframeURL: http://localhost:8081/public/sqcr-demo/html/scale-tones.html
iframeSelector: .scale-tones-frame

### Random Tones from a Scale

<iframe class="scale-tones-frame" width="100%" src="/blank.html" frameborder=0></iframe>

---

class: center, middle

### Better.

--

#### But can we do a bit better.

---

class: center, top
iframeURL: /public/sqcr-demo/html/notes-graph.html
iframeSelector: .scale-tones-graph-frame

#### Markov Chaining of Tones in a Scale

<iframe class="scale-tones-graph-frame" width="100%" height="100%" src="/blank.html" frameborder=0></iframe>

---

class: center, middle

# Markov Chain

![](https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Markovkate_01.svg/220px-Markovkate_01.svg.png)

---

class: center, middle

## What Does This Have To Do With HipHop?

---

class: center, middle

# Harmony & Rhythm:

### A few important terms before we get to hip hop

---

# Harmony

--

-   **tone** - a unit of sound (aka a **note**) <img src="https://i.imgur.com/Oq5SzEq.png" width=300 />

--

-   **scale** - a ranked _Set_ of pitched tones <img src="https://i.imgur.com/mu2XHAd.png" width=300 />

--

-   **melody** - a sequence of tones over time <img src="https://i.imgur.com/EJZeByT.png" width=300 />

---

# Harmony

--

-   **chord** - a group of tones played in (or close to) unison <img src="https://i.imgur.com/R1gBVQL.png" width=300 />

--

-   **progression** - a sequence of chords over time <img src="https://i.imgur.com/QRjNIda.png" width=300 />

---

# Rhythm

-   **beat** - a single unit of rhythm <img src="https://i.imgur.com/cpjlCGz.png" width=50 />

-   **measure** - a regularly spaced group of beats <img src="https://i.imgur.com/Ow5xhm0.png" width=300 />

-   **duration** - how long a tone lasts

---

# Rhythm

### Durations and Fractions

-   Durations are all described as fractions of a **measure**

--

-   1/4 Note

--

-   1/8 Note

--

-   1/16 Note

---

class: middle, center

# Rhythm and Computation

---

iframeURL: /public/sqcr-demo/html/808.html
iframeSelector: .frame-808

# Roland TR-808

<iframe src="/blank.html" width="100%" height="100%" class="frame-808" frameborder="0"></iframe>

---

# Rhythm as Code

#### Beat Grids

![](https://i.stack.imgur.com/DTE8c.png)

---

# Rhythm as Code

#### Beat Grids as Code

```javascript
const kicks = [1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0];
const snares = [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0];
const hats = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
const cowbell = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0];
```

---

# Rhythm Notation

#### Beat Grids as "Words"

```javascript
const kicks = fmt('1010 0010 0010 0010');
const snares = fmt('0000 1000 0000 1000');
const hats = fmt('1111 1111 1111 1111');
const cowbell = fmt('0000 0000 0000 01010');
```

---

class: center, middle

# So what is Music?

---

# Music is...

--

-   ## Lists

--

-   ## Time

--

-   ## State Changes

--

-   ## Traversing a Directed (Often Cyclic) Graph

---

class: center, middle

# Markov Chains

![](https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Markovkate_01.svg/220px-Markovkate_01.svg.png)

---

# Markov Chain Implementation

```javascript
class MarkovChain {
    constructor(obj = {}, states = [], initialState = 0) {
        this.graph = { ...obj };
        this.states = [...states];
        this.currentState = initialState;
    }

    set() {
        const newState = this.sample(this.graph[this.currentState]);
        this.currentState = newState;
    }

    next() {
        this.set();
        return this.states[this.currentState];
    }

    sample(list) {
        return list[parseInt(list.length * Math.random())];
    }
}
```

---

# Markov Chain of Notes

```javascript
const NOTES = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

const G = {
    '0': [1, 1, 0, 3, 4, 5, 6], // Repeated values add "weight"
    '1': [0, 0, 2, 3],
    '2': [1, 3, 4],
    '3': [4],
    '4': [5],
    '5': [5, 4, 1, 0],
    '6': [2, 2, 2, 3, 3],
};

const mc = new MarkovChain(G, NOTES);
```

(Not using adjacency matrices for code readability, but they can also be used.)

---

# Markov Chain of Chords

```javascript
var CHORDS = [];

var G = {
    '0': [1, 1, 0, 3, 4, 5, 6],
    '1': [0, 0, 2, 3],
    '2': [1, 3, 4],
    '3': [4],
    '4': [5],
    '5': [5, 4, 1, 0],
    '6': [2, 2, 2, 3, 3],
};
```

---

# Markov Chain of Snare Patterns

```javascript
var SNARES = [];

var G = {
    '0': [1, 1, 0, 3, 4, 5, 6],
    '1': [0, 0, 2, 3],
    '2': [1, 3, 4],
    '3': [4],
    '4': [5],
    '5': [5, 4, 1, 0],
    '6': [2, 2, 2, 3, 3],
};
```

---

iframeURL: /public/sqcr-demo/html/matrix-16x8.html
iframeSelector: .matrix-16x8

# Generative Drake Remix Using Markov Chains

<iframe class="matrix-16x8" width="560" height="315" src="/blank.html" frameborder="0"></iframe>

---

# Conclusion

-   Careful randomization
-   Embrace a little music theory
-   TBD
