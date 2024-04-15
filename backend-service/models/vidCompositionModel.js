const CompositionSchema = new mongoose.Schema({
  state: { type: String, default: "pending" },
  inferenceScope: { type: [Number], default: [] },
  date_compiled: { type: Date },
  approvedInferences: [{ type: Number, default: [] }],
  rejectedInferences: [{ type: Number, default: [] }],
});

CompositionSchema.methods.updateInferences = function (index, decision) {
  const indexAsNumber = parseInt(index);
  if (decision === "approve") {
    if (!this.approvedInferences.includes(indexAsNumber)) {
      this.approvedInferences.push(indexAsNumber);
      this.rejectedInferences = this.rejectedInferences.filter(
        (i) => i !== indexAsNumber
      );
    }
  } else if (decision === "reject") {
    if (!this.rejectedInferences.includes(indexAsNumber)) {
      this.rejectedInferences.push(indexAsNumber);
      this.approvedInferences = this.approvedInferences.filter(
        (i) => i !== indexAsNumber
      );
    }
  }
};

const Composition = mongoose.model("Composition", jobSchema);

module.exports = Composition;
