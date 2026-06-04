# Using SQUAD

See (https://github.com/bradygaster/squad/)[https://github.com/bradygaster/squad/]

## 1. Install Squad

```bash
npm install -g @bradygaster/squad-cli
squad init
```
## 2. Authenticate with GitHub (for Issues, PRs, and Ralph)

```bash
gh auth login
```

**✓ Validate:** Run `gh auth status` — you should see "Logged in to github.com".

## 3. Open Copilot with the Agent

```
copilot --agent squad --yolo
```

  > **Why `--yolo`?** Squad makes many tool calls in a typical session. Without it, Copilot will prompt you to approve each one.

**✓ Validate:** Squad responds with team member proposals. Type `yes` to confirm — they're ready to work.

Squad proposes a team — each member named from a persistent thematic cast. You say **yes**. They're ready.

## 4. Get to work!

In the chat, use a prompt like this:

```text
I'm starting a new project. Set up the team based on the Firefly universe.
Here's what I'm building: please review the docs/prd-vehicle-charging.md file for the product requirements.
For the initial MVP, focus implementation on the Dashboard tab only.
Make Cars, Stations, Simulation, and Settings functional placeholder tabs with clear future-stage messaging.
Try to make it look nice and graphical and as close to the live-target-state.png as you can. The road should have three lanes and look nice so the cars look good crossing the road. 
```

Follow-up prompt

```text
Please implement a queueing system so that cars will wait in line when the bays are full. when a bay is available move one car into that bay and make sure the others cars wait for their turn.
```

---
