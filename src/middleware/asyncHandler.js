//!  Error handling middleware function 
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(error => {
      next(error);
    })
  }
} 