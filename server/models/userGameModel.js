import mongoose from "mongoose";
const { Schema } = mongoose;

// Player Schema
const PlayerSchema = new Schema({
  id: String,
  firstname: String,
  lastname: String,
  position: String,
  number: Number,
  goals: Number,
  assist: Number,
  technicalFault: Number,
  fastbreak: Number,
  save: Number,
  missedShotCloseRange: Number,
  missedShotDistance: Number,
  offensiveFoul: Number,
  penaltyGoals: Number,
  penaltyMissed: Number,
  penalties: Number,
  yellowCards: Number,
  redCards: Number,
  blueCards: Number, 
  type: String,
});

const OfficialSchema = new Schema({
  id: String,
  firstname: String,
  lastname: String,
  position: String,
  timePenalties: Schema.Types.Mixed,
  warnings: Number,
  disqualifications: Schema.Types.Mixed,
  disqualificationWithBlueCards: Schema.Types.Mixed,
  type: String,
});

const RefereeSchema = new Schema({
  id: String,
  firstname: String,
  lastname: String,
  position: String,
  type: String,
});

// Lineup Schema
const LineupSchema = new Schema({
  home: [PlayerSchema],
  homeOfficials: [OfficialSchema],
  away: [PlayerSchema],
  awayOfficials: [OfficialSchema],
  referees: [RefereeSchema],
});

// Event Schema
const EventSchema = new Schema({
  id: Number,
  type: String,
  time: String,
  score: String,
  timestamp: Number,
  team: Schema.Types.Mixed,
  message: String,
});

// Tournament Schema
const TournamentSchema = new Schema({
  id: String,
  name: String,
  acronym: String,
  logo: String,
  livestreamUrl: String,
  organization: String,
  currentRound: Schema.Types.Mixed,
  table: Schema.Types.Mixed,
  tournamentType: String,
  ageGroup: String,
  tableHint: String,
  type: String,
});

// Phase Schema
const PhaseSchema = new Schema({
  id: String,
  name: String,
  acronym: String,
  type: String,
});

// Round Schema
const RoundSchema = new Schema({
  id: String,
  name: String,
  acronym: String,
  number: Number,
  startsAt: Date,
  endsAt: Date,
  current: Boolean,
  games: Schema.Types.Mixed,
  type: String,
});

// Field Schema
const FieldSchema = new Schema({
  id: String,
  name: String,
  acronym: String,
  logo: String,
  livestreamUrl: String,
  city: String,
  type: String,
});

// Team Schema
const TeamSchema = new Schema({
  id: String,
  name: String,
  acronym: String,
  logo: String,
  livestreamUrl: String,
  teamGroupId: Number,
  club: String,
  defaultTournament: String,
  previousGame: Schema.Types.Mixed,
  nextGame: Schema.Types.Mixed,
  type: String,
});
// Summary Schema
const SummarySchema = new Schema({
  id: String,
  tournament: TournamentSchema,
  phase: PhaseSchema,
  round: RoundSchema,
  field: FieldSchema,
  homeTeam: TeamSchema,
  awayTeam: TeamSchema,
  refereeInfo: Schema.Types.Mixed,
  livestreamUrl: String,
  customUrl: String,
  customUrlLabel: String,
  startsAt: Date,
  attendance: Number,
  pdfUrl: String,
  tickerRef: Schema.Types.Mixed,
  showTime: Boolean,
  showPresstext: Boolean,
  state: String,
  extraStates: Schema.Types.Mixed,
  remarks: Schema.Types.Mixed,
  homeGoals: Number,
  awayGoals: Number,
  homeGoalsHalf: Number,
  awayGoalsHalf: Number,
  type: String,
});
const userGameModelSchema = new Schema({
  userId: { type: String, required: true },
  summary: { type: SummarySchema, default: {} },
  lineup: { type: LineupSchema, default: {} },
  events: { type: [EventSchema], default: [] },
});
const userGameModel = mongoose.model("userGameModel", userGameModelSchema);
export default userGameModel;
