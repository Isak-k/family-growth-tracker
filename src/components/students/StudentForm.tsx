 import { useState } from 'react';
 import { Button } from '@/components/ui/button';
 import { Input } from '@/components/ui/input';
 import { Label } from '@/components/ui/label';
 import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
 } from '@/components/ui/select';
 import { Checkbox } from '@/components/ui/checkbox';
 import type { Student } from '@/pages/Students';
 
 interface StudentFormProps {
   initialData: Student | null;
   academicYears: { id: string; name: string }[];
   onSave: (student: Omit<Student, 'id'> & { password?: string }) => void;
   onCancel: () => void;
 }
 
 export const StudentForm = ({
   initialData,
   academicYears,
   onSave,
   onCancel,
 }: StudentFormProps) => {
   const [formData, setFormData] = useState({
     firstName: initialData?.firstName || '',
     lastName: initialData?.lastName || '',
     email: initialData?.email || '',
     dateOfBirth: initialData?.dateOfBirth || '',
     gender: initialData?.gender || 'male' as 'male' | 'female',
     enrollmentDate: initialData?.enrollmentDate || new Date().toISOString().split('T')[0],
     academicYearIds: initialData?.academicYearIds || [] as string[],
     status: initialData?.status || 'active' as 'active' | 'inactive' | 'graduated',
   });
   const [password, setPassword] = useState('');
 
   const handleSubmit = (e: React.FormEvent) => {
     e.preventDefault();
     onSave({ ...formData, password: password || undefined });
   };
 
   const toggleAcademicYear = (yearId: string) => {
     setFormData(prev => ({
       ...prev,
       academicYearIds: prev.academicYearIds.includes(yearId)
         ? prev.academicYearIds.filter(id => id !== yearId)
         : [...prev.academicYearIds, yearId],
     }));
   };
 
   return (
     <form onSubmit={handleSubmit} className="space-y-4">
       <div className="grid grid-cols-2 gap-4">
         <div className="space-y-2">
           <Label htmlFor="firstName">First Name</Label>
           <Input
             id="firstName"
             value={formData.firstName}
             onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
             required
           />
         </div>
         <div className="space-y-2">
           <Label htmlFor="lastName">Last Name</Label>
           <Input
             id="lastName"
             value={formData.lastName}
             onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
             required
           />
         </div>
       </div>
 
       <div className="space-y-2">
         <Label htmlFor="email">Email</Label>
         <Input
           id="email"
           type="email"
           value={formData.email}
           onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
           required
         />
       </div>

       {!initialData && (
         <div className="space-y-2 rounded-lg border border-border p-3 bg-muted/30">
           <Label htmlFor="childPassword">Child login password</Label>
           <Input
             id="childPassword"
             type="password"
             minLength={6}
             placeholder="At least 6 characters (leave empty to skip)"
             value={password}
             onChange={(e) => setPassword(e.target.value)}
           />
           <p className="text-xs text-muted-foreground">Your child signs in with the email above and this password.</p>
         </div>
       )}
 
       <div className="grid grid-cols-2 gap-4">
         <div className="space-y-2">
           <Label htmlFor="dateOfBirth">Date of Birth</Label>
           <Input
             id="dateOfBirth"
             type="date"
             value={formData.dateOfBirth}
             onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
             required
           />
         </div>
         <div className="space-y-2">
           <Label htmlFor="gender">Gender</Label>
           <Select
             value={formData.gender}
             onValueChange={(value: 'male' | 'female') =>
               setFormData(prev => ({ ...prev, gender: value }))
             }
           >
             <SelectTrigger>
               <SelectValue />
             </SelectTrigger>
             <SelectContent>
               <SelectItem value="male">Male</SelectItem>
               <SelectItem value="female">Female</SelectItem>
             </SelectContent>
           </Select>
         </div>
       </div>
 
       <div className="grid grid-cols-2 gap-4">
         <div className="space-y-2">
           <Label htmlFor="enrollmentDate">Enrollment Date</Label>
           <Input
             id="enrollmentDate"
             type="date"
             value={formData.enrollmentDate}
             onChange={(e) => setFormData(prev => ({ ...prev, enrollmentDate: e.target.value }))}
             required
           />
         </div>
         <div className="space-y-2">
           <Label htmlFor="status">Status</Label>
           <Select
             value={formData.status}
             onValueChange={(value: 'active' | 'inactive' | 'graduated') =>
               setFormData(prev => ({ ...prev, status: value }))
             }
           >
             <SelectTrigger>
               <SelectValue />
             </SelectTrigger>
             <SelectContent>
               <SelectItem value="active">Active</SelectItem>
               <SelectItem value="inactive">Inactive</SelectItem>
               <SelectItem value="graduated">Graduated</SelectItem>
             </SelectContent>
           </Select>
         </div>
       </div>
 
       <div className="space-y-2">
         <Label>Assign to Academic Years</Label>
         <div className="border border-border rounded-lg p-3 space-y-2 max-h-40 overflow-y-auto">
           {academicYears.map((year) => (
             <div key={year.id} className="flex items-center gap-2">
               <Checkbox
                 id={`year-${year.id}`}
                 checked={formData.academicYearIds.includes(year.id)}
                 onCheckedChange={() => toggleAcademicYear(year.id)}
               />
               <Label htmlFor={`year-${year.id}`} className="cursor-pointer font-normal">
                 {year.name}
               </Label>
             </div>
           ))}
           {academicYears.length === 0 && (
             <p className="text-sm text-muted-foreground">No academic years available</p>
           )}
         </div>
       </div>
 
       <div className="flex gap-3 pt-4">
         <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
           Cancel
         </Button>
         <Button type="submit" variant="hero" className="flex-1">
           {initialData ? 'Save Changes' : 'Add Student'}
         </Button>
       </div>
     </form>
   );
 };