import mongoose from 'mongoose';

const favouritesSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  perfumeNames: {
    type: [String],
    required: true,
  },
}, {
  timestamps: true,
});

const Favourites = mongoose.model('Favourites', favouritesSchema);

export default Favourites;
