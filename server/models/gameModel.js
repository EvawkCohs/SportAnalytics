import mongoose from "mongoose";

const gameModelSchema = new mongoose.Schema(
  {
    data: {
      summary: {
        id: String,
        tournament: {
          id: String,
          name: String,
        },
        phase: {
          id: String,
          name: String,
        },
        round: {
          id: String,
          name: String,
          number: String,
          startsAt: Number,
          endsAt: Number,
        },
        homeTeam: {
          id: String,
          name: String,
          acronym: String,
          teamGroupId: Number,
        },
        awayTeam: {
          id: String,
          name: String,
          acronym: String,
          teamGroupId: Number,
        },
        startsAt: Number,
        attendance: Number,
        state: {
          type: String,
          enum: ["Live", "Post", "Pre"],
          default: "Pre",
        },
        homeGoals: Number,
        awayGoals: Number,
        homeGoalsHalf: Number,
        awayGoalsHalf: Number,
      },
      lineup: {
        home: {
          type: [
            {
              id: String,
              firstname: String,
              lastname: String,
              position: String,
              number: Number,
              goals: Number,
              penaltyGoals: Number,
              penaltyMissed: Number,
              penalties: Number,
              yellowCards: Number,
              redCards: Number,
              type: {
                type: String,
                enum: ["Player", "StaffMember", "Referee"],
                default: "Player",
              },
            },
          ],
        },
        homeOfficials: {
          type: [
            {
              id: String,
              firstname: String,
              lastname: String,
              position: String,
              timePenalties: Number,
              warnings: Number,
              disqualifications: Number,
              type: {
                type: String,
                enum: ["Player", "StaffMember", "Referee"],
                default: "StaffMember",
              },
            },
          ],
        },
        away: {
          type: [
            {
              id: String,
              firstname: String,
              lastname: String,
              position: String,
              number: Number,
              goals: Number,
              penaltyGoals: Number,
              penaltyMissed: Number,
              penalties: Number,
              yellowCards: Number,
              redCards: Number,
              type: {
                type: String,
                enum: ["Player", "StaffMember", "Referee"],
                default: "Player",
              },
            },
          ],
        },
        awayOfficials: {
          type: [
            {
              id: String,
              firstname: String,
              lastname: String,
              position: String,
              timePenalties: Number,
              warnings: Number,
              disqualifications: Number,
              type: {
                type: String,
                enum: ["Player", "StaffMember", "Referee"],
                default: "StaffMember",
              },
            },
          ],
        },
        referees: {
          type: [
            {
              id: String,
              firstname: String,
              lastname: String,
              position: String,
              type: {
                type: String,
                enum: ["Player", "StaffMember", "Referee"],
                default: "Referee",
              },
            },
          ],
        },
      },
      events: {
        type: [
          {
            id: Number,
            type: {
              type: String,
              enum: [
                "Goal",
                "StopPeriod",
                "Timeout",
                "TwoMinutePenalty",
                "SevenMeterGoal",
                "SevenMeterMissed",
                "StartPeriod",
                "Warning",
                "Disqualification",
              ],
              dafault: "Goal",
            },
            time: String,
            score: String,
            timestamp: Number,
            team: String,
            message: String,
          },
        ],
      },
    },
  },
  { timestamps: true }
);

const gameModel = mongoose.model("gameModel", gameModelSchema);
export default gameModel;
