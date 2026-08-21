import User from '../models/User.js';

export async function getAddresses(req, res, next) {
  try {
    res.json(req.user.addresses || []);
  } catch (err) { next(err); }
}

export async function addAddress(req, res, next) {
  try {
    const user = await User.findById(req.user._id);
    user.addresses.push(req.body);
    await user.save();
    res.status(201).json(user.addresses);
  } catch (err) { next(err); }
}

export async function updateAddress(req, res, next) {
  try {
    const user = await User.findById(req.user._id);
    const idx = parseInt(req.params.index, 10);
    if (isNaN(idx) || idx < 0 || idx >= user.addresses.length) {
      return res.status(404).json({ message: 'Address not found' });
    }
    user.addresses.set(idx, { ...user.addresses[idx].toObject(), ...req.body });
    await user.save();
    res.json(user.addresses);
  } catch (err) { next(err); }
}

export async function deleteAddress(req, res, next) {
  try {
    const user = await User.findById(req.user._id);
    const idx = parseInt(req.params.index, 10);
    if (isNaN(idx) || idx < 0 || idx >= user.addresses.length) {
      return res.status(404).json({ message: 'Address not found' });
    }
    user.addresses.splice(idx, 1);
    await user.save();
    res.json(user.addresses);
  } catch (err) { next(err); }
}
