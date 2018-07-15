class: center, middle

# Making Self-Generating Hip Hop in JS

---

class: center, middle

# What is Music?

---

# Harmony

-   **tone** - a unit of sound

--

-   **scale** - a family of pitched tones

--

-   **melody** - a sequence of tones over time

--

-   **chord** - a group of tones played in (or close to) unison

--

-   **progression** - a sequence of chords over time

---

# Harmony as Code

These concepts can be represented as lists in code:

```javascript
// Scale
const C_MAJOR_SCALE = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

// Melody
const TWINKLE_TWINKLE_MELODY = ['C', 'C', 'G', 'G', 'A', 'A', 'G'];
```

---

# Harmony As Code (Chords)

```javascript
// Chords
const C_MAJOR_CHORDS = [
    ['C major', ['C', 'E', 'F']],
    ['D minor', ['D', 'F', 'A']],
    ['E minor', ['E', 'G', 'B']],
    ['F major', ['F', 'A', 'C']],
    ['G major', ['G', 'B', 'D']],
    ['A minor', ['A', 'C', 'E']],
    ['B diminished', ['B', 'D', 'F']],
];

// Progression
const STAIRWAY_TO_HEAVEN_CHORDS = [
    'A minor',
    'E major',
    'C major',
    'D major',
    'F major',
    'D major',
    'A minor',
];
```

---

# Rhythm

-   **beat** - a single unit of rhythm

-   **measure** - a regularly spaced group of beats

---

# Rhythm Notation

#### Beat Grids

![](https://i.stack.imgur.com/DTE8c.png)

---

# Rhythm Notation

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

# Notes

```javascript
var NOTES = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

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

# Notes

<iframe width="560" height="315" src="/public/graphs/index.html" frameborder="0"></iframe>

---

# Progressions

---

# Conclusion In Progress

```typescript
interface Foo {
    hello: string;
    world: number;
}
```
