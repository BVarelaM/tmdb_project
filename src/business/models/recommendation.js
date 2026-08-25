const recommendationItem = (data) => ({
  recommendationId: data.recommendationId, 
  senderUserId: data.senderUserId,      
  receiverUserId: data.receiverUserId,
  movie: Number(data.movie.tmdbId),
  message: data.message || '',
  status: 'pending', // 'pending' | 'accepted' | 'rejected'
  createdAt: new Date(),
  updatedAt: new Date()
});

module.exports = { recommendationItem };